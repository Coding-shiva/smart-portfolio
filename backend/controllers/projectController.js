import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { technologies: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  const { title, description, technologies, githubLink, liveLink, image, category, featured, order } = req.body;

  try {
    const project = new Project({
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      image,
      category,
      featured,
      order,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { title, description, technologies, githubLink, liveLink, image, category, featured, order } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title ?? project.title;
      project.description = description ?? project.description;
      project.technologies = technologies ?? project.technologies;
      project.githubLink = githubLink ?? project.githubLink;
      project.liveLink = liveLink ?? project.liveLink;
      project.image = image ?? project.image;
      project.category = category ?? project.category;
      project.featured = featured ?? project.featured;
      project.order = order ?? project.order;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
