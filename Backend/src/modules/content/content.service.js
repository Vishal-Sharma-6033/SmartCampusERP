import Content from "../content/content.model.js";
import storageService from "../../services/storage.service.js";
import User from "../user/user.model.js"
import ApiError from "../../utils/ApiError.js";
// ✅ CREATE CONTENT
export const create = async (req) => {
  let fileData = {};

  if (req.file) {
    console.log("FILE:", req.file.mimetype); // ✅ debug

    const uploaded = await storageService.upload(req.file.path);

    fileData.fileUrl = uploaded.url;
    fileData.publicId = uploaded.public_id;

    // ✅ OPTIONAL (but useful)
    if (req.file.mimetype.startsWith("video")) {
      fileData.type = "video";
    } else if (req.file.mimetype.startsWith("jpg")) {
      fileData.type = "jpg";
    } else if (req.file.mimetype === "application/pdf") {
      fileData.type = "pdf";
    }
  }

  return await Content.create({
    ...req.body,
    ...fileData,
    uploadedBy: req.user._id,
  });
};

// ✅ GET ALL CONTENT (🔥 SEARCH + FILTER + PAGINATION + SORT)
//  export const  getAll = async (query) => {
//   // 🔥 PAGINATION
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // 🔥 FILTER
//   const filter = {};

//   if (query.subjectId) filter.subjectId = query.subjectId;
//   if (query.type) filter.type = query.type;
//   if (query.semester) filter.semester = query.semester;

//   // 🔥 SEARCH
//   if (query.search) {
//     filter.title = {
//       $regex: query.search,
//       $options: "i",
//     };
//   }

//   // 🔥 SORT
//   let sortOption = { createdAt: -1 }; // latest default
//   if (query.sort === "oldest") sortOption = { createdAt: 1 };

//   // 🔥 DATA FETCH
//   const data = await Content.find(filter)
//     .populate("subjectId", "name")
//     .sort(sortOption)
//     .skip(skip)
//     .limit(limit);

//   const total = await Content.countDocuments(filter);

//   return {
//     data,
//     pagination: {
//       total,
//       page,
//       limit,
//       pages: Math.ceil(total / limit),
//     },
//   };
// };
export const getAll = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.search) {
    filter.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  const data = await Content.find(filter)
    .skip(skip)
    .limit(limit);

  const total = await Content.countDocuments(filter);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
    },
  };
};

// ✅ GET SINGLE CONTENT
 export const getById = async (id) => {
  const content = await Content.findById(id).populate("subjectId");

  if (!content) throw new Error("Content not found");

  return content;
};

// ✅ DELETE CONTENT (FIXED NAME)
export const deleteContent = async (id) => {
  const content = await Content.findById(id);

  if (!content) throw new Error("Content not found");

  // cloud delete
  if (content.publicId) {
    await storageService.deletes(content.publicId);
  }

  await Content.findByIdAndDelete(id);
};

// ✅ INCREMENT VIEWS
 export const incrementViews = async (id) => {
  return await Content.findByIdAndUpdate(
    id,
    { $inc: { view: 1 } },
    { new: true }
  );
};

// ✅ INCREMENT DOWNLOADS
 export const incrementDownloads = async (id) => {
  return await Content.findByIdAndUpdate(
    id,
    { $inc: { download: 1 } },
    { new: true }
  );
};




export const toggleBookmark = async (userId, contentId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not Found"); 
  }

  user.bookmarks = user.bookmarks || [];

  const alreadySaved = user.bookmarks.some(
    (id) => id.toString() === contentId.toString()
  );

  if (alreadySaved) {
    user.bookmarks.pull(contentId);
  } else {
    user.bookmarks.push(contentId);
  }

  await user.save();

  return user.bookmarks;
};



const ContentService={
    create,getAll, getById,deleteContent,incrementViews, incrementDownloads, toggleBookmark
}
export default ContentService;