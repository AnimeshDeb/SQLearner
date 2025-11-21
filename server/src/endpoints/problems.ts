import { Router, Request, Response } from 'express';

import { getAllProblemsSummary, getProblemBySlug } from '../../data/problems';

const router = Router();

//problemlist data
router.get('/', (req: Request, res: Response) => {
    try {
        const problemsSummary = getAllProblemsSummary();
        res.json(problemsSummary);
    } catch (error) {
        console.error("Error fetching problem list:", error);
        res.status(500).json({ message: "Failed to fetch problem list" });
    }
});

//problem detail data
router.get('/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const problem = getProblemBySlug(slug);
        
        if (problem) {
            // Send the full problem object
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