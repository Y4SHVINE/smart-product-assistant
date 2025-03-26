import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/',authenticateUser, async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
    res.json(categories);
    return;
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Get category by ID
router.get('/:id',authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: +id },
      include: {
        products: true,
      },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(category);
    return;
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Create category (protected route)
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
      include: {
        products: true,
      },
    });

    res.status(201).json(category);
    return;
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Update category (protected route)
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id: +id },
      data: {
        name,
        description,
      },
      include: {
        products: true,
      },
    });

    res.json(category);
    return;
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Delete category (protected route)
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id: +id },
      include: {
        products: true,
      },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (category.products.length > 0) {
      res.status(400).json({ error: 'Cannot delete category with associated products' });
      return;
    }

    await prisma.category.delete({
      where: { id: +id },
    });

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router; 