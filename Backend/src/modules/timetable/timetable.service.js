import TimeTable from './timetable.model.js';
import ApiError from '../../utils/ApiError.js';

export const createTimetable = async(data)=>{
    return await TimeTable.create(data)
}

export const getWeeklyTimetable = async(className, section)=>{
    return await TimeTable.find({className,section}).sort({ day:1})
}

