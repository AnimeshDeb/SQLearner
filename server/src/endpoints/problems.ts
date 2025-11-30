// inside your router file
import express, { Request, Response } from 'express';
import { getGroupedProblems, getProblemBySlug } from '../../data/problems'; // Adjust path

const router = express.Router();

// GET /api/problems - Returns grouped list
router.get('/', (req: Request, res: Response) => {
    try {
        const groupedData = getGroupedProblems();
        res.json(groupedData);
    } catch (error) {
        console.error("Error fetching grouped problems:", error);
        res.status(500).json({ message: "Failed to fetch problems" });
    }
});

// GET /api/problems/:slug - Returns specific problem (Unchanged)
router.get('/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const problem = getProblemBySlug(slug);
        
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).json({ message: `Problem with slug '${slug}' not found` });
        }
    } catch (error) {
        console.error(`Error fetching problem ${slug}:`, error);
        res.status(500).json({ message: "Failed to fetch problem detail" });
    }
});

export default router;