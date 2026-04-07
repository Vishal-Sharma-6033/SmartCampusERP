import Subject from '../academic/subject.model.js';
import Notice from '../notice/notice.model.js';
import Book from '../library/book.model.js';
import Assignment from '../assignment/assignment.model.js';

export const globalSearch = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const regex = new RegExp(query, 'i');

  const [subjects, notices, books, assignments] = await Promise.all([
    Subject.find({ $text: { $search: query } })
      .select('name code')
      .limit(limit)
      .skip(skip),

    Notice.find({
      $or: [
        { title: regex },
        { content: regex }
      ]
    }).limit(limit).skip(skip),

    Book.find({
      $or: [
        { title: regex },
        { author: regex }
      ]
    }).limit(limit).skip(skip),

    Assignment.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(limit).skip(skip),
  ]);

  return {
    subjects,
    notices,
    books,
    assignments,
  };
};