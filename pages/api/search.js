import Product from '../../models/Product';
import db from "../../utils/db";
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.connectDb();
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const searchQuery = q.trim().toLowerCase();
    const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
    
    // Build search conditions
    const searchConditions = [];
    
    // Exact match (highest priority)
    searchConditions.push({
      $or: [
        { title: { $regex: `^${searchQuery}`, $options: 'i' } },
        { category: { $regex: `^${searchQuery}`, $options: 'i' } }
      ]
    });
    
    // Contains all words (high priority)
    if (searchWords.length > 1) {
      const allWordsCondition = {
        $and: searchWords.map(word => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } },
            { category: { $regex: word, $options: 'i' } }
          ]
        }))
      };
      searchConditions.push(allWordsCondition);
    }
    
         // Contains any word (medium priority)
     searchConditions.push({
       $or: [
         { title: { $regex: searchQuery, $options: 'i' } },
         { description: { $regex: searchQuery, $options: 'i' } },
         { category: { $regex: searchQuery, $options: 'i' } },
         { 
           $and: [
             { tags: { $ne: null } },
             { tags: { $in: searchWords.map(word => new RegExp(word, 'i')) } }
           ]
         }
       ]
     });
    
    // Partial word match (lower priority)
    searchConditions.push({
      $or: searchWords.map(word => ({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } },
          { category: { $regex: word, $options: 'i' } }
        ]
      }))
    });

         // Execute search with aggregation for better ranking
     const products = await Product.aggregate([
       {
         $match: {
           $or: searchConditions
         }
       },
       {
         $addFields: {
           // Ensure fields exist and are not null
           title: { $ifNull: ["$title", ""] },
           description: { $ifNull: ["$description", ""] },
           category: { $ifNull: ["$category", ""] },
           tags: { $ifNull: ["$tags", []] }
         }
       },
      {
        $addFields: {
          // Calculate relevance score
          relevanceScore: {
            $sum: [
              // Exact title match: 10 points
              { $cond: [{ $regexMatch: { input: { $toLower: "$title" }, regex: `^${searchQuery}` } }, 10, 0] },
              // Exact category match: 8 points
              { $cond: [{ $regexMatch: { input: { $toLower: "$category" }, regex: `^${searchQuery}` } }, 8, 0] },
              // Title contains query: 6 points
              { $cond: [{ $regexMatch: { input: { $toLower: "$title" }, regex: searchQuery } }, 6, 0] },
              // Category contains query: 5 points
              { $cond: [{ $regexMatch: { input: { $toLower: "$category" }, regex: searchQuery } }, 5, 0] },
              // Description contains query: 3 points
              { $cond: [{ $regexMatch: { input: { $toLower: "$description" }, regex: searchQuery } }, 3, 0] },
                             // Tags match: 4 points per matching tag
               {
                 $multiply: [
                   { 
                     $size: { 
                       $setIntersection: [
                         { $ifNull: ["$tags", []] }, 
                         searchWords
                       ] 
                     } 
                   },
                   4
                 ]
               }
            ]
          }
        }
      },
      {
        $sort: { relevanceScore: -1 }
      },
      {
        $limit: 15
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          slug: 1,
          image: 1,
          price: 1,
          relevanceScore: 1
        }
      }
    ]);

         // Format results with relevance info
     const results = products.map(product => ({
       type: 'product',
       title: product.title || 'Không có tên',
       description: product.description ? 
         (product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description) : 
         'Không có mô tả',
       slug: product.slug || '',
       image: product.image || '',
       price: product.price || 0,
       category: product.category || 'Không phân loại',
       relevanceScore: product.relevanceScore || 0
     }));

    // Get unique categories from results
    const categories = [...new Set(products.map(p => p.category))];
    const categoryResults = categories.slice(0, 3).map(category => ({
      type: 'category',
      title: category,
      description: `Xem tất cả sản phẩm ${category}`,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      relevanceScore: 5 // Medium relevance for categories
    }));

    // Combine and sort by relevance
    const allResults = [...results, ...categoryResults]
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 10);

    // Remove relevanceScore from final response
    const finalResults = allResults.map(({ relevanceScore, ...item }) => item);

    res.json(finalResults);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
