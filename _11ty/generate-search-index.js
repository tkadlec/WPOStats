module.exports = async function(collection) {
  const searchIndex = [];
  
  for (const item of collection) {
    const content = await item.template.read();
    searchIndex.push({
      title: item.data.title,
      url: item.url,
      content: content,
      // Add any other fields you want to search through
    });
  }
  
  return searchIndex;
}; 