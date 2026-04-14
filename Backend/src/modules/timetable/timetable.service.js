import TimeTable from './timetable.model.js';
import ApiError from '../../utils/ApiError.js';


//Time overlap check
const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Validate Period Overlap (same class)
const validatePeriodOverlap = (periods) => {
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const p1 = periods[i];
      const p2 = periods[j];

      if (
        isTimeOverlap(p1.startTime, p1.endTime, p2.startTime, p2.endTime)
      ) {
        throw new ApiError(
          400,
          `Time overlap between ${p1.subject} and ${p2.subject}`
        );
      }
    }
  }
};

//  Validate Teacher Clash 
const validateTeacherClash = async (className, section, day, periods) => {
  const existing = await TimeTable.find({ day });

  for (const newPeriod of periods) {
    for (const timetable of existing) {
      for (const oldPeriod of timetable.periods) {
        if (newPeriod.teacher === oldPeriod.teacher) {
          if (
            isTimeOverlap(
              newPeriod.startTime,
              newPeriod.endTime,
              oldPeriod.startTime,
              oldPeriod.endTime
            )
          ) {
            throw new ApiError(
              400,
              `Teacher ${newPeriod.teacher} already assigned at this time`
            );
          }
        }
      }
    }
  }
};

//  CREATE 
export const createTimetable = async (data) => {
  const { className, section, day, periods } = data;

  validatePeriodOverlap(periods);
  await validateTeacherClash(className, section, day, periods);
  const exists = await TimeTable.findOne({ className, section, day });

  if (exists) {
    throw new ApiError(400, "Timetable already exists for this class/day");
  }

  return await TimeTable.create(data);
};


export const getWeeklyTimetable = async(className, section)=>{
    return await TimeTable.find({className,section}).sort({ day:1})
}

export const getCurrentTimetable = async(className, section)=>{
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });

    const timeTable = await TimeTable.findOne({ className, section, day: today });
    if(!timeTable){
        throw new ApiError(404, "No timetable found for today");
    }
    return timeTable;
}
export const getTimetableByDate = async(date, className, section)=>{
    const day = new Date(date).toLocaleString('en-US', { weekday: 'long' });

    const timeTable = await TimeTable.findOne({ className, section, day });
    if(!timeTable){
        throw new ApiError(404, "No timetable found for selected date");
    }
    return timeTable;
}


//  SMART TIMETABLE GENERATOR
export const generateSmartTimetable = async ({
  className,
  section,
  subjects,
  teachers,
  startTime = 9,
  periodsPerDay = 6,
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timetableData = [];

  for (const day of days) {
    let currentTime = startTime;
    const periods = [];

    for (let i = 0; i < periodsPerDay; i++) {
      const subject = subjects[i % subjects.length];
      const teacher = teachers[subject];

      const start = `${String(currentTime).padStart(2, "0")}:00`;
      const end = `${String(currentTime + 1).padStart(2, "0")}:00`;

      periods.push({
        subject,
        teacher,
        startTime: start,
        endTime: end,
      });

      currentTime++;
    }

    validatePeriodOverlap(periods);
    await validateTeacherClash(className, section, day, periods);

    timetableData.push({
      className,
      section,
      day,
      periods,
    });
  }

  return await TimeTable.insertMany(timetableData);
};