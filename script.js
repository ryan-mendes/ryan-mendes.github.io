const USER = 'ryan-mendes';

const projects = [
  { name: 'Gerenciamento de TI', repo: 'Gerenciamento-de-TI', desc: 'Sistema full stack de gestão de usuários com autenticação JWT e painéis por perfil (Admin, Gestor e Usuário).', tags: ['Node.js', 'Express', 'Sequelize', 'Next.js'] },
  { name: 'Task Management API', repo: 'task-management-api', desc: 'API REST de tarefas com NestJS: CRUD, filtros, autenticação JWT, hash de senha e validação de DTOs.', tags: ['NestJS', 'TypeScript', 'Docker'] },
  { name: 'Lojinha', repo: 'lojinha', desc: 'E-commerce com carrinho de compras, cadastro de clientes e produtos e painel administrativo.', tags: ['Python', 'Flask', 'SQLite'] },
  { name: 'Gestão de Refeitório', repo: 'gestao-refeitorio', desc: 'Modelagem de um sistema de refeitório escolar: escopo, casos de uso, diagrama de classes e interações.', tags: ['UML', 'Engenharia de Software'] },
  { name: 'FlaskApp', repo: 'FlaskApp', desc: 'Aplicação web em Flask com páginas de login, cadastro e compras, persistência em SQLite e logs.', tags: ['Python', 'Flask'] },
  { name: 'Portfólio', repo: 'ryan-mendes.github.io', desc: 'Este site: HTML, CSS e JavaScript puros, responsivo e publicado no GitHub Pages.', tags: ['HTML', 'CSS', 'JavaScript'] },
];

const grid = document.getElementById('project-grid');
grid.innerHTML = projects.map(p => `
  <a class="card" href="https://github.com/${USER}/${p.repo}" target="_blank" rel="noopener">
    <h4>${p.name}</h4>
    <p>${p.desc}</p>
    <div class="tags">${p.tags.map(t => `<span>#${t}</span>`).join('')}</div>
    <span class="link">Ver no GitHub →</span>
  </a>`).join('');

document.getElementById('year').textContent = new Date().getFullYear();
