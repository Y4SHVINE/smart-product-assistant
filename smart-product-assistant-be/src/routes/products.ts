import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import { openai } from '../config/openAPI';

const router = Router();
const prisma = new PrismaClient();

// Get all products
router.get('/',authenticateUser, async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    res.json(products);
    return;
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Get product by ID
router.get('/:id',authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: +id },
      include: {
        category: true,
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
    return;
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// AI-powered product search
router.post('/search', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    // Get all products for context
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    // Create a prompt for OpenAI
    const prompt = `
      Based on the following user query: "${query}"
      And the following product catalog:
      ${JSON.stringify(products, null, 2)}
      
      Please recommend the most relevant products and explain why they match the user's needs.
      Return the response in the following JSON format:
      {
        "recommendations": [
          {
            "productId": "string",
            "relevanceScore": number (0-1),
            "explanation": "string"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      res.status(500).json({ error: 'Failed to get AI recommendations' });
      return;
    }

    const recommendations = JSON.parse(content);

    // Get full product details for recommendations
    const recommendedProducts = await Promise.all(
      recommendations.recommendations.map(async (rec: any) => {
        const product = products.find((p) => p.id === +rec.productId);
        return {
          ...product,
          relevanceScore: rec.relevanceScore,
          explanation: rec.explanation,
        };
      })
    );

    res.json(recommendedProducts);
    return;
  } catch (error) {
    console.error('Error in product search:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Create product (protected route)
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, categoryId, attributes } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        attributes,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(product);
    return;
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Update product (protected route)
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, categoryId, attributes } = req.body;

    const product = await prisma.product.update({
      where: { id: +id },
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        attributes,
      },
      include: {
        category: true,
      },
    });

    res.json(product);
    return;
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Delete product (protected route)
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: +id },
    });

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router; 