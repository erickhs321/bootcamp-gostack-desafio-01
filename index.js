const express = require("express");
const server = express();

server.use(express.json());
server.use(registerNumberOfRequests);

const projects = [];
let numberOfRequests = 0;

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: "id and title required" });
  }

  const project = projects.find(p => p.id === id);

  if (project) {
    return res
      .status(400)
      .json({ error: "there is already a project with this id" });
  }

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", verifyIfProjectExists, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title required" });
  }

  const { project } = req;

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", verifyIfProjectExists, (req, res) => {
  const { project } = req;
  const index = projects.findIndex(p => p === project);
  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", verifyIfProjectExists, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title required" });
  }

  const { project } = req;

  project.tasks.push(title);

  return res.json(projects);
});

function verifyIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  req.project = project;

  if (!project) {
    return res.status(400).json({ error: "project does not exists" });
  }

  return next();
}

function registerNumberOfRequests(req, res, next) {
  numberOfRequests += 1;
  console.log(`Number of requests: ${numberOfRequests}`);

  return next();
}

server.listen(3000);
