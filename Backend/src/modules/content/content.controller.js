import asyncHandlers from "../../utils/asyncHandler.js";
import ContentService from '../content/content.service.js'
import * as AIService from "../ai/ai.service.js";
 export const createContent = asyncHandlers(async (req, res) => {
  const content = await ContentService.create(req);

  res.json({
    success: true,
    data: content,
  });
});

 export const getAllContent = asyncHandlers(async (req, res) => {
  const data = await ContentService.getAll(req.query);

  res.json({
    success: true,
    ...data,
    data,
  });
});

 export const getContentById = asyncHandlers(async (req, res) => {
  const data = await ContentService.getById(req.params.id);

  res.json({
    success: true,
    data,
  });
});

 export const deleteContent = asyncHandlers(async (req, res) => {
  await ContentService.deleteContent(req.params.id);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
});

 export const addView = async (req, res) => {
  const data = await ContentService.incrementViews(req.params.id);

  res.json({
    success: true,
    data,
  });
};
 export const addDownload = async (req, res) => {
  const data = await ContentService.incrementDownloads(req.params.id);

  res.json({
    success: true,
    data,
  });
};

export const bookmarkContent = async (req, res) => {
  console.log("USER:", req.user);
  const data = await ContentService.toggleBookmark(
    req.user.id,
    req.params.id
  );
  

  res.json({
    success: true,
    bookmarks: data,
  });
  
};
export const summarizeContent = asyncHandlers(async(req,res)=>{
  const content = await ContentService.getById(req.params.id);
  const summary = await AIService.generateSummary(content.description || content.title);

  res.json({success:true, summary})
})
export const generateQuizs = asyncHandlers(async(req,res)=>{
  const content = await ContentService.getById(req.params.id);
  const quiz = await AIService.generateQuiz(content.title);

  res.json({success:true, quiz})
})

export const streamVideo = asyncHandlers(async(req,res)=>{
  const content = await ContentService.getById(req.params.id)
  
  if(!content){
    return res.status(400).json({message:"Content not found"})
  }
  if(content.type !== "video"){
    return res.status(400).json({message:"It is not in video format, Invalid Format"})
  }

  res.json({
    success:true,
    videoUrl : content.fileUrl
  })
})

export const secureDownload = asyncHandlers(async(req,res)=>{
  const content = await ContentService.getById(req.params.id)
  
  if(!content){
    return res.status(400).json({message:"Content not found"})
  }

  res.json({
    success:true,
    fileUrl: content.fileUrl
  })
  
  
})

export const previewContent = async (req, res) => {
  const content = await ContentService.getById(req.params.id);

  if (!content) {
    return res.status(404).json({ message: "Content not found" });
  }

  if (content.type !== "pdf" && content.type !== "note") {
    return res.status(400).json({ message: "Preview not supported" });
  }

  res.json({
    success: true,
    previewUrl: content.fileUrl,
  });
};

const controller={
    createContent,getAllContent,getContentById,deleteContent,addDownload,addView,bookmarkContent, summarizeContent, generateQuizs, streamVideo, secureDownload, previewContent, 
}
export default controller;
<<<<<<< HEAD
=======

>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31
