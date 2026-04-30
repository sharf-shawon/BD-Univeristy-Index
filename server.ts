import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { UniversityCategory, University } from "./src/types";

const DATA_PATH = path.join(process.cwd(), "data", "universities.json");

function getUniversities(): University[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/categories", (req, res) => {
    res.json(Object.values(UniversityCategory));
  });

  app.get("/api/universities", (req, res) => {
    try {
      const { category, district, q } = req.query;
      let universities = getUniversities();

      if (category) {
        universities = universities.filter(u => u.category === category);
      }
      if (district) {
        universities = universities.filter(u => u.district?.toLowerCase().includes(String(district).toLowerCase()));
      }
      if (q) {
        const search = String(q).toLowerCase();
        universities = universities.filter(u => 
          u.name.toLowerCase().includes(search) || 
          u.slug.toLowerCase().includes(search) ||
          u.district?.toLowerCase().includes(search)
        );

        // Prioritize results
        universities.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const aSlug = a.slug.toLowerCase();
          const bSlug = b.slug.toLowerCase();

          // Rule 1: Exact name match
          if (aName === search && bName !== search) return -1;
          if (bName === search && aName !== search) return 1;

          // Rule 2: Exact slug match
          if (aSlug === search && bSlug !== search) return -1;
          if (bSlug === search && aSlug !== search) return 1;

          // Rule 3: Name starts with search string
          if (aName.startsWith(search) && !bName.startsWith(search)) return -1;
          if (bName.startsWith(search) && !aName.startsWith(search)) return 1;

          return 0;
        });
      }

      res.json({
        data: universities,
        total: universities.length,
        categories: Object.values(UniversityCategory),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch universities" });
    }
  });

  app.get("/api/universities/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const universities = getUniversities();
      const university = universities.find(u => u.slug === slug);
      
      if (university) {
        res.json(university);
      } else {
        res.status(404).json({ error: "University not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch university details" });
    }
  });

  app.get("/api/validate/email", (req, res) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!emailDomain) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const universities = getUniversities();
    const match = universities.find(u => {
      if (!u.website) return false;
      try {
        const uDomain = new URL(u.website).hostname.replace('www.', '').toLowerCase();
        // Exact match or subdomain match (e.g. name@dept.du.ac.bd for du.ac.bd)
        return emailDomain === uDomain || emailDomain.endsWith('.' + uDomain);
      } catch {
        return false;
      }
    });

    if (match) {
      res.json({
        isValid: true,
        match: {
          id: match.id,
          name: match.name,
          category: match.category,
          website: match.website,
          isVerified: match.isVerified
        }
      });
    } else {
      res.json({ isValid: false, message: "No matching institutional domain found" });
    }
  });

  app.get("/api/validate/domain", (req, res) => {
    const { domain } = req.query;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: "Domain parameter is required" });
    }

    const queryDomain = domain.toLowerCase().replace('www.', '');
    const universities = getUniversities();
    
    const match = universities.find(u => {
      if (!u.website) return false;
      try {
        const uDomain = new URL(u.website).hostname.replace('www.', '').toLowerCase();
        // Exact match or subdomain match
        return queryDomain === uDomain || queryDomain.endsWith('.' + uDomain);
      } catch {
        return false;
      }
    });

    if (match) {
      res.json({
        isValid: true,
        match: {
          id: match.id,
          name: match.name,
          category: match.category,
          website: match.website
        }
      });
    } else {
      res.json({ isValid: false, message: "Domain not found in official registry" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
