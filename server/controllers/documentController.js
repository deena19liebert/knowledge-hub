const Document = require('../models/Document');
const geminiService = require('../services/geminiService');

// Q&A endpoint
const answerQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    
    // Get all accessible documents
    const query = req.user.role === 'admin' 
      ? {} 
      : { $or: [{ createdBy: req.user._id }, { isPublic: true }] };
    
    const documents = await Document.find(query).select('title content');
    
    if (documents.length === 0) {
      return res.json({ answer: 'No documents available to answer your question.' });
    }
    
    // Create context from documents
    const context = documents.map(doc => 
      `Title: ${doc.title}\nContent: ${doc.content}`
    ).join('\n\n---\n\n');
    
    const prompt = `Based on the following documents, answer this question: "${question}"\n\nDocuments:\n${context}\n\nProvide a helpful answer based on the information above.`;
    
    const response = await geminiService.model.generateContent(prompt);
    const answer = response.response.text();
    
    res.json({ answer });
  } catch (error) {
    console.error('Q&A error:', error);
    res.status(500).json({ message: 'Error answering question' });
  }
};

module.exports = {
  // ... existing exports
  answerQuestion
};

const manualSummarize = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const summary = await geminiService.generateSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
};

const manualGenerateTags = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const tags = await geminiService.generateTags(content);
    res.json({ tags });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ message: 'Error generating tags' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { $or: [{ createdBy: req.user._id }, { isPublic: true }] };
    
    const documents = await Document.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

// Create new document
const createDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    
    // Generate AI enhancements (basic version without Gemini for now)
    const summary = content.substring(0, 200) + '...';
    const tags = ['general']; // Will be enhanced with Gemini later
    
    const document = new Document({
      title,
      content,
      summary,
      tags,
      isPublic: isPublic || false,
      createdBy: req.user._id
    });
    
    await document.save();
    await document.populate('createdBy', 'name email');
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: 'Error creating document' });
  }
};

// Get single document
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check permissions
    if (document.createdBy._id.toString() !== req.user._id.toString() && 
        !document.isPublic && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document' });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check permissions
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    document.title = title;
    document.content = content;
    document.isPublic = isPublic;
    document.summary = content.substring(0, 200) + '...';
    
    await document.save();
    await document.populate('createdBy', 'name email');
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document' });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check permissions
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
};

module.exports = {
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  manualSummarize,
  manualGenerateTags,
  answerQuestion

};
