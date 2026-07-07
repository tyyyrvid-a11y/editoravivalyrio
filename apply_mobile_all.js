const fs = require('fs');
const pathIndex = 'c:\\Users\\Artur\\Downloads\\files\\index.html';
const pathAdmin = 'c:\\Users\\Artur\\Downloads\\files\\admin.html';

// 1. Update index.html
let htmlIndex = fs.readFileSync(pathIndex, 'utf8');

const mobileCSSIndex = `
  /* Full Mobile Optimization */
  @media (max-width: 768px) {
    .futuros-grid, .autoras-grid, .blog-grid, .evento-grid, .diferenciais-grid, .mvv-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }
    .futuros, .blog, .eventos, .autoras, .quem-somos {
      padding: 60px 16px !important;
    }
    .hero-container {
      padding: 0 16px !important;
    }
    .footer-container {
      flex-direction: column !important;
      text-align: center !important;
      gap: 24px !important;
      padding: 40px 16px !important;
    }
    .footer-links {
      justify-content: center !important;
      gap: 16px !important;
      flex-wrap: wrap !important;
    }
  }
</style>`;

if (!htmlIndex.includes('/* Full Mobile Optimization */')) {
    htmlIndex = htmlIndex.replace('</style>', mobileCSSIndex);
    fs.writeFileSync(pathIndex, htmlIndex, 'utf8');
}

// 2. Update admin.html
let htmlAdmin = fs.readFileSync(pathAdmin, 'utf8');

const mobileCSSAdmin = `
  /* Admin Mobile Optimization */
  @media (max-width: 768px) {
    .admin-layout { flex-direction: column !important; }
    .sidebar { 
      position: static !important; 
      width: 100% !important; 
      height: auto !important; 
      padding: 20px !important; 
      border-right: none !important; 
      border-bottom: 1px solid rgba(0,0,0,0.05) !important; 
    }
    .main-content { 
      margin-left: 0 !important; 
      padding: 20px 16px !important; 
    }
    .dashboard-grid { 
      grid-template-columns: 1fr !important; 
      gap: 16px !important;
    }
    .admin-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
    .table-container {
      margin: 0 !important;
      border-radius: 12px !important;
    }
  }
</style>`;

if (!htmlAdmin.includes('/* Admin Mobile Optimization */')) {
    htmlAdmin = htmlAdmin.replace('</style>', mobileCSSAdmin);
    fs.writeFileSync(pathAdmin, htmlAdmin, 'utf8');
}

console.log('apply_mobile_all done');
