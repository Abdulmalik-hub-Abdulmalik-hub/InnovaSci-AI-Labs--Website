import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";

const adapter = new PrismaLibSql({
  url: "file:prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create users with hashed passwords
  const hashedPassword = await hash("AdminPassword2026!", 12);
  const ceoPassword = await hash("CeoPassword2026!", 12);
  const ctoPassword = await hash("CtoPassword2026!", 12);
  const directorPassword = await hash("DirectorPassword2026!", 12);
  const researcherPassword = await hash("ResearcherPassword2026!", 12);
  const medicalPassword = await hash("MedicalPassword2026!", 12);
  const aiEngPassword = await hash("AiEngPassword2026!", 12);
  const swEngPassword = await hash("SwEngPassword2026!", 12);
  const scientistPassword = await hash("ScientistPassword2026!", 12);
  const pmPassword = await hash("PmPassword2026!", 12);
  const hrPassword = await hash("HrPassword2026!", 12);
  const financePassword = await hash("FinancePassword2026!", 12);
  const contentPassword = await hash("ContentPassword2026!", 12);
  const visitorPassword = await hash("VisitorPassword2026!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@innovasci.ai",
      password: hashedPassword,
      name: "System Administrator",
      role: "SUPER_ADMIN",
      department: "Administration",
    },
  });

  const ceo = await prisma.user.create({
    data: {
      email: "ceo@innovasci.ai",
      password: ceoPassword,
      name: "Alexandra Chen",
      role: "CEO",
      department: "Executive",
    },
  });

  const cto = await prisma.user.create({
    data: {
      email: "cto@innovasci.ai",
      password: ctoPassword,
      name: "Marcus Rodriguez",
      role: "CTO",
      department: "Technology",
    },
  });

  const director = await prisma.user.create({
    data: {
      email: "director@innovasci.ai",
      password: directorPassword,
      name: "Dr. Sarah Kim",
      role: "RESEARCH_DIRECTOR",
      department: "AI Research",
    },
  });

  const researcher = await prisma.user.create({
    data: {
      email: "researcher@innovasci.ai",
      password: researcherPassword,
      name: "Dr. James Wilson",
      role: "DATA_SCIENTIST",
      department: "AI Research",
    },
  });

  const medical = await prisma.user.create({
    data: {
      email: "medical@innovasci.ai",
      password: medicalPassword,
      name: "Dr. Emily Parker",
      role: "RESEARCH_DIRECTOR",
      department: "Medical AI",
    },
  });

  const aiEng = await prisma.user.create({
    data: {
      email: "ai_eng@innovasci.ai",
      password: aiEngPassword,
      name: "David Chen",
      role: "AI_ENGINEER",
      department: "AI Research",
    },
  });

  const swEng = await prisma.user.create({
    data: {
      email: "sw_eng@innovasci.ai",
      password: swEngPassword,
      name: "Michael Brown",
      role: "SOFTWARE_ENGINEER",
      department: "Engineering",
    },
  });

  const scientist = await prisma.user.create({
    data: {
      email: "scientist@innovasci.ai",
      password: scientistPassword,
      name: "Dr. Lisa Wang",
      role: "DATA_SCIENTIST",
      department: "Data Science",
    },
  });

  const pm = await prisma.user.create({
    data: {
      email: "pm@innovasci.ai",
      password: pmPassword,
      name: "Rachel Green",
      role: "PRODUCT_MANAGER",
      department: "Product",
    },
  });

  const hr = await prisma.user.create({
    data: {
      email: "hr@innovasci.ai",
      password: hrPassword,
      name: "Jennifer Martinez",
      role: "HR_MANAGER",
      department: "Human Resources",
    },
  });

  const finance = await prisma.user.create({
    data: {
      email: "finance@innovasci.ai",
      password: financePassword,
      name: "Robert Taylor",
      role: "FINANCE_MANAGER",
      department: "Finance",
    },
  });

  const content = await prisma.user.create({
    data: {
      email: "content@innovasci.ai",
      password: contentPassword,
      name: "Amanda Foster",
      role: "CONTENT_MANAGER",
      department: "Communications",
    },
  });

  await prisma.user.create({
    data: {
      email: "visitor@innovasci.ai",
      password: visitorPassword,
      name: "Public Visitor",
      role: "PUBLIC_VISITOR",
      department: null,
    },
  });

  console.log("Users created");

  // Create AI Models
  const novaModel = await prisma.aIModel.create({
    data: {
      name: "InnovaSci Nova",
      version: "3.5",
      description: "Our flagship large language model optimized for reasoning, coding, and creative tasks.",
      status: "ACTIVE",
      parameters: 70,
      contextWindow: 128000,
      capabilities: JSON.stringify(["Text Generation", "Code Completion", "Math Reasoning", "Creative Writing", "Analysis"]),
      benchmarks: JSON.stringify({ "MMLU": "89.2%", "HumanEval": "92.1%", "GSM8K": "95.8%" }),
      apiEndpoint: "https://api.innovasci.ai/v1/nova",
      pricing: JSON.stringify({ "base": { "price": "$0.002", "period": "per 1K tokens" } }),
      createdById: cto.id,
    },
  });

  await prisma.aIModel.create({
    data: {
      name: "InnovaSci Genesis",
      version: "2.0",
      description: "Multimodal model capable of understanding and generating images, text, and code.",
      status: "ACTIVE",
      parameters: 45,
      contextWindow: 8192,
      capabilities: JSON.stringify(["Image Understanding", "Text-to-Image", "Document Analysis", "Code Generation"]),
      benchmarks: JSON.stringify({ "VQAv2": "86.5%", "COCO": "78.3%", "DocVQA": "91.2%" }),
      apiEndpoint: "https://api.innovasci.ai/v1/genesis",
      createdById: aiEng.id,
    },
  });

  await prisma.aIModel.create({
    data: {
      name: "InnovaSci Medical",
      version: "1.2",
      description: "Specialized model for medical research, diagnosis assistance, and clinical documentation.",
      status: "ACTIVE",
      parameters: 30,
      contextWindow: 16384,
      capabilities: JSON.stringify(["Medical Analysis", "Drug Interaction", "Clinical Notes", "Research Summarization"]),
      benchmarks: JSON.stringify({ "MedQA": "92.5%", "PubMed QA": "88.7%", "Medical Bench": "91.1%" }),
      createdById: medical.id,
    },
  });

  console.log("AI Models created");

  // Create Training Runs
  await prisma.trainingRun.create({
    data: {
      modelId: novaModel.id,
      status: "COMPLETED",
      startTime: new Date("2024-05-01"),
      endTime: new Date("2024-05-15"),
      duration: 1260000,
      datasetSize: 15000000000,
      hyperparameters: JSON.stringify({ "learning_rate": 0.0001, "batch_size": 32, "epochs": 50 }),
      metrics: JSON.stringify({ "loss": 0.05, "perplexity": 1.23 }),
    },
  });

  await prisma.trainingRun.create({
    data: {
      modelId: novaModel.id,
      status: "RUNNING",
      startTime: new Date("2024-06-01"),
      datasetSize: 20000000000,
      hyperparameters: JSON.stringify({ "learning_rate": 0.00008, "batch_size": 64, "epochs": 100 }),
    },
  });

  console.log("Training Runs created");

  // Create Research Projects
  await prisma.researchProject.create({
    data: {
      name: "Next-Gen Reasoning Architecture",
      description: "Research into novel neural network architectures for enhanced logical reasoning and planning capabilities.",
      status: "ACTIVE",
      department: "AI Research",
      budget: 2500000,
      spentBudget: 850000,
      startDate: new Date("2024-01-15"),
      progress: 45,
      leadResearcherId: director.id,
    },
  });

  await prisma.researchProject.create({
    data: {
      name: "Medical AI Diagnostics",
      description: "Developing AI systems to assist in early detection and diagnosis of diseases using medical imaging.",
      status: "ACTIVE",
      department: "Medical AI",
      budget: 5000000,
      spentBudget: 2100000,
      startDate: new Date("2023-09-01"),
      progress: 62,
      leadResearcherId: medical.id,
    },
  });

  await prisma.researchProject.create({
    data: {
      name: "Multimodal Understanding",
      description: "Research into models that can seamlessly understand and generate content across text, images, and video.",
      status: "ACTIVE",
      department: "AI Research",
      budget: 3000000,
      spentBudget: 1200000,
      startDate: new Date("2024-03-01"),
      progress: 38,
      leadResearcherId: aiEng.id,
    },
  });

  await prisma.researchProject.create({
    data: {
      name: "Efficient Fine-tuning Methods",
      description: "Developing new techniques for efficient model fine-tuning with minimal computational resources.",
      status: "PLANNING",
      department: "AI Research",
      budget: 1500000,
      startDate: new Date("2024-07-01"),
      progress: 0,
      leadResearcherId: researcher.id,
    },
  });

  console.log("Research Projects created");

  // Create Publications
  await prisma.publication.create({
    data: {
      title: "Scaling Laws for Reasoning in Large Language Models",
      abstract: "We present a comprehensive study of scaling laws specifically for reasoning capabilities in large language models, discovering that reasoning performance follows distinct patterns from general language capabilities.",
      authors: JSON.stringify(["Dr. Sarah Kim", "David Chen", "Dr. James Wilson"]),
      journal: "Nature Machine Intelligence",
      year: 2024,
      doi: "10.1038/s42256-024-00812-x",
      keywords: JSON.stringify(["Scaling Laws", "Reasoning", "LLM", "Emergent Abilities"]),
      status: "PUBLISHED",
      createdById: director.id,
    },
  });

  await prisma.publication.create({
    data: {
      title: "Medical Diagnosis Assistance: A Clinical Evaluation",
      abstract: "This paper presents a rigorous clinical evaluation of our AI-assisted diagnostic system across multiple medical specialties, demonstrating significant improvements in early detection rates.",
      authors: JSON.stringify(["Dr. Emily Parker", "Dr. Sarah Kim", "Dr. Lisa Wang"]),
      journal: "The Lancet Digital Health",
      year: 2024,
      doi: "10.1016/S2589-7500(24)00089-5",
      keywords: JSON.stringify(["Medical AI", "Diagnosis", "Clinical Evaluation", "Healthcare"]),
      status: "PUBLISHED",
      createdById: medical.id,
    },
  });

  await prisma.publication.create({
    data: {
      title: "Efficient Training via Sparse Mixture of Experts",
      abstract: "We introduce a novel sparse mixture-of-experts architecture that achieves state-of-the-art results while reducing computational requirements by 80%.",
      authors: JSON.stringify(["David Chen", "Marcus Rodriguez"]),
      journal: "ICML 2024",
      year: 2024,
      keywords: JSON.stringify(["MoE", "Efficient Training", "Scaling"]),
      status: "PUBLISHED",
      createdById: cto.id,
    },
  });

  await prisma.publication.create({
    data: {
      title: "Towards General Medical Understanding",
      abstract: "A draft paper exploring the foundations of building a unified medical AI system capable of across multiple medical domains.",
      authors: JSON.stringify(["Dr. Emily Parker"]),
      keywords: JSON.stringify(["Medical AI", "Foundation Models", "Healthcare"]),
      status: "DRAFT",
      createdById: medical.id,
    },
  });

  console.log("Publications created");

  // Create Datasets
  await prisma.dataset.create({
    data: {
      name: "Medical Imaging Corpus v3",
      description: "Comprehensive dataset of medical images including X-rays, CT scans, and MRIs with expert annotations.",
      size: "500GB",
      licenseType: "CC BY 4.0",
      storageLocation: "s3://innovasci-datasets/medical-imaging-v3",
      format: "Image",
      domain: "Medical",
      uploadedById: scientist.id,
    },
  });

  await prisma.dataset.create({
    data: {
      name: "Scientific Paper Corpus",
      description: "Collection of 50M scientific papers with abstracts, citations, and metadata for research purposes.",
      size: "2TB",
      licenseType: "CC0 1.0",
      storageLocation: "s3://innovasci-datasets/scientific-papers",
      format: "JSON",
      domain: "Scientific",
      uploadedById: researcher.id,
    },
  });

  await prisma.dataset.create({
    data: {
      name: "Code Generation Benchmark",
      description: "High-quality dataset of programming problems with solutions in multiple languages for code generation training.",
      size: "50GB",
      licenseType: "MIT",
      storageLocation: "s3://innovasci-datasets/code-bench",
      format: "JSON",
      domain: "Computer Vision",
      uploadedById: aiEng.id,
    },
  });

  console.log("Datasets created");

  // Create Products
  await prisma.product.create({
    data: {
      name: "InnovaSci Nova Platform",
      slug: "innovasci-nova",
      description: "Enterprise AI platform powered by our Nova model family. Includes API access, fine-tuning tools, and dedicated support.",
      category: "PLATFORM",
      version: "3.5",
      status: "ACTIVE",
      parameters: JSON.stringify({ "max_tokens": 128000, "languages": 50, "context_window": 128000 }),
      pricing: JSON.stringify({ "starter": { "price": "$99/mo", "period": "monthly" }, "pro": { "price": "$499/mo", "period": "monthly" }, "enterprise": { "price": "Custom", "period": "contact us" } }),
      documentation: "https://docs.innovasci.ai/nova",
      features: JSON.stringify(["API Access", "Fine-tuning", "Analytics", "Team Collaboration", "Priority Support", "Custom Deployment"]),
    },
  });

  await prisma.product.create({
    data: {
      name: "Genesis Vision Suite",
      slug: "genesis",
      description: "Complete multimodal AI toolkit for image understanding, generation, and document processing.",
      category: "TOOL",
      version: "2.0",
      status: "ACTIVE",
      parameters: JSON.stringify({ "image_resolution": "1024x1024", "supported_formats": ["PNG", "JPEG", "WebP"] }),
      features: JSON.stringify(["Image Understanding", "Text-to-Image", "Document OCR", "Visual QA"]),
    },
  });

  await prisma.product.create({
    data: {
      name: "Medical AI Assistant",
      slug: "medical-assistant",
      description: "AI-powered clinical decision support system for healthcare professionals.",
      category: "SERVICE",
      version: "1.2",
      status: "BETA",
      parameters: JSON.stringify({ "specialties": 12, "accuracy": "92.5%" }),
      features: JSON.stringify(["Diagnosis Assistance", "Drug Interaction Check", "Clinical Notes", "Research Summaries"]),
    },
  });

  await prisma.product.create({
    data: {
      name: "AI API Gateway",
      slug: "api-gateway",
      description: "Unified API gateway for all InnovaSci AI services with rate limiting, authentication, and monitoring.",
      category: "API",
      version: "1.0",
      status: "ACTIVE",
      parameters: JSON.stringify({ "rate_limit": "10000 req/min", "uptime": "99.99%" }),
      features: JSON.stringify(["Unified Access", "Rate Limiting", "Authentication", "Usage Analytics", "Webhook Support"]),
    },
  });

  console.log("Products created");

  // Create Job Listings
  await prisma.jobListing.create({
    data: {
      title: "Senior AI Engineer",
      department: "AI Research",
      type: "FULL_TIME",
      level: "SENIOR",
      description: "Join our team to work on cutting-edge AI research and development.",
      requirements: JSON.stringify(["5+ years experience", "PhD in CS or related", "Publications preferred", "Python, PyTorch"]),
      salaryMin: 200000,
      salaryMax: 350000,
      location: "San Francisco, CA",
      remote: true,
      status: "OPEN",
      createdById: hr.id,
    },
  });

  await prisma.jobListing.create({
    data: {
      title: "Research Scientist - NLP",
      department: "Research",
      type: "FULL_TIME",
      level: "SENIOR",
      description: "Conduct fundamental research in natural language processing and contribute to our publication goals.",
      requirements: JSON.stringify(["PhD in NLP or ML", "Strong publication record", "Experience with LLMs", "Python, PyTorch, JAX"]),
      salaryMin: 220000,
      salaryMax: 400000,
      location: "San Francisco, CA",
      remote: true,
      status: "OPEN",
      createdById: hr.id,
    },
  });

  await prisma.jobListing.create({
    data: {
      title: "Machine Learning Engineer",
      department: "AI Research",
      type: "FULL_TIME",
      level: "MID",
      description: "Build and scale ML infrastructure and training pipelines.",
      requirements: JSON.stringify(["3+ years ML engineering", "Experience with distributed training", "Python, Kubernetes", "AWS/GCP"]),
      salaryMin: 150000,
      salaryMax: 250000,
      location: "Remote",
      remote: true,
      status: "OPEN",
      createdById: hr.id,
    },
  });

  console.log("Job Listings created");

  // Create Budget Allocations
  await prisma.budgetAllocation.create({
    data: {
      department: "AI Research",
      fiscalYear: 2024,
      allocated: 5000000,
      spent: 2100000,
      category: "RESEARCH",
      notes: "Annual research budget allocation",
      updatedById: finance.id,
    },
  });

  await prisma.budgetAllocation.create({
    data: {
      department: "Medical AI",
      fiscalYear: 2024,
      allocated: 3000000,
      spent: 1800000,
      category: "RESEARCH",
      notes: "Medical AI research initiatives",
      updatedById: finance.id,
    },
  });

  await prisma.budgetAllocation.create({
    data: {
      department: "Infrastructure",
      fiscalYear: 2024,
      allocated: 4000000,
      spent: 2200000,
      category: "INFRASTRUCTURE",
      notes: "Compute and cloud infrastructure",
      updatedById: finance.id,
    },
  });

  await prisma.budgetAllocation.create({
    data: {
      department: "Operations",
      fiscalYear: 2024,
      allocated: 1500000,
      spent: 800000,
      category: "OPERATIONS",
      notes: "General operational expenses",
      updatedById: finance.id,
    },
  });

  console.log("Budget Allocations created");

  // Create Grants
  await prisma.grant.create({
    data: {
      name: "AI Safety Research Initiative",
      funder: "National Science Foundation",
      amount: 2000000,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
      description: "Multi-year grant for AI safety and alignment research",
    },
  });

  await prisma.grant.create({
    data: {
      name: "Medical AI Development",
      funder: "Bill & Melinda Gates Foundation",
      amount: 5000000,
      startDate: new Date("2023-06-01"),
      endDate: new Date("2026-05-31"),
      status: "ACTIVE",
      description: "Funding for developing AI solutions for healthcare in developing nations",
    },
  });

  console.log("Grants created");

  // Create News Articles
  await prisma.newsArticle.create({
    data: {
      title: "InnovaSci AI Labs Raises $500M in Series C Funding",
      slug: "series-c-funding",
      content: "We are thrilled to announce the successful completion of our $500M Series C funding round, led by Sequoia Capital with participation from Andreessen Horowitz and Google Ventures. This investment will accelerate our research in AI safety, expand our compute infrastructure, and grow our world-class team of researchers and engineers.",
      excerpt: "Funding will accelerate AI safety research and expand compute infrastructure.",
      category: "MILESTONE",
      status: "PUBLISHED",
      publishedAt: new Date("2024-05-15"),
      authorId: content.id,
    },
  });

  await prisma.newsArticle.create({
    data: {
      title: "Partnership with Johns Hopkins University",
      slug: "johns-hopkins-partnership",
      content: "InnovaSci AI Labs is proud to announce a strategic partnership with Johns Hopkins University to advance medical AI research. The collaboration will focus on developing AI systems for early disease detection, drug discovery, and clinical decision support.",
      excerpt: "Collaboration to advance medical AI research and clinical applications.",
      category: "PARTNERSHIP",
      status: "PUBLISHED",
      publishedAt: new Date("2024-04-20"),
      authorId: content.id,
    },
  });

  await prisma.newsArticle.create({
    data: {
      title: "Nova 3.5 Release: Enhanced Reasoning Capabilities",
      slug: "nova-3-5-release",
      content: "We are excited to announce the release of Nova 3.5, our most advanced language model to date. This version features significant improvements in logical reasoning, code generation, and creative tasks. Nova 3.5 achieves state-of-the-art results on multiple benchmarks including MMLU, HumanEval, and GSM8K.",
      excerpt: "Our most advanced model with enhanced reasoning and coding capabilities.",
      category: "ANNOUNCEMENT",
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-10"),
      authorId: content.id,
    },
  });

  console.log("News Articles created");

  // Create Events
  await prisma.event.create({
    data: {
      title: "AI Research Summit 2024",
      description: "Annual conference bringing together leading AI researchers to discuss the future of artificial intelligence.",
      type: "CONFERENCE",
      location: "San Francisco, CA",
      startDate: new Date("2024-09-15"),
      endDate: new Date("2024-09-17"),
      status: "SCHEDULED",
      createdById: content.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Medical AI Workshop",
      description: "Hands-on workshop focused on applying AI techniques to medical research and healthcare.",
      type: "WORKSHOP",
      location: "Boston, MA",
      startDate: new Date("2024-08-20"),
      endDate: new Date("2024-08-22"),
      status: "SCHEDULED",
      createdById: content.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "AI Safety Seminar Series",
      description: "Weekly seminar featuring talks from leading AI safety researchers.",
      type: "SEMINAR",
      location: "Online",
      startDate: new Date("2024-07-01"),
      status: "SCHEDULED",
      createdById: content.id,
    },
  });

  console.log("Events created");

  // Create Compute Resources
  await prisma.computeResource.create({
    data: {
      name: "GPU Cluster A100",
      type: "GPU",
      provider: "AWS",
      status: "IN_USE",
      specs: JSON.stringify({ "count": 1024, "type": "A100 80GB", "total_memory": "32TB" }),
      costPerHour: 32.77,
    },
  });

  await prisma.computeResource.create({
    data: {
      name: "Training Server Farm",
      type: "GPU",
      provider: "Self-hosted",
      status: "IN_USE",
      specs: JSON.stringify({ "count": 512, "type": "H100", "total_memory": "16TB" }),
      costPerHour: 28.50,
    },
  });

  await prisma.computeResource.create({
    data: {
      name: "Storage Cluster",
      type: "STORAGE",
      provider: "Google Cloud",
      status: "AVAILABLE",
      specs: JSON.stringify({ "capacity": "10PB", "type": "SSD", "iops": 1000000 }),
      costPerHour: 5.00,
    },
  });

  console.log("Compute Resources created");

  // Create API Endpoints
  await prisma.aPIEndpoint.create({
    data: {
      path: "/v1/nova",
      method: "POST",
      description: "Nova model inference endpoint",
      status: "ACTIVE",
      lastChecked: new Date(),
      responseTime: 120,
      errorRate: 0.001,
    },
  });

  await prisma.aPIEndpoint.create({
    data: {
      path: "/v1/genesis",
      method: "POST",
      description: "Genesis multimodal model endpoint",
      status: "ACTIVE",
      lastChecked: new Date(),
      responseTime: 180,
      errorRate: 0.002,
    },
  });

  await prisma.aPIEndpoint.create({
    data: {
      path: "/v1/embeddings",
      method: "POST",
      description: "Text embedding generation endpoint",
      status: "ACTIVE",
      lastChecked: new Date(),
      responseTime: 45,
      errorRate: 0.0005,
    },
  });

  console.log("API Endpoints created");

  // Create System Settings
  await prisma.systemSetting.create({
    data: {
      key: "MAINTENANCE_MODE",
      value: "false",
      description: "Enable/disable maintenance mode",
      updatedBy: admin.id,
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "MAX_API_RATE",
      value: "10000",
      description: "Maximum API requests per minute",
      updatedBy: admin.id,
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "FEATURE_FLAGS",
      value: JSON.stringify({ "new_model": true, "beta_features": false }),
      description: "Feature flag configuration",
      updatedBy: admin.id,
    },
  });

  console.log("System Settings created");

  // Create Platform Metrics
  await prisma.platformMetric.create({
    data: {
      name: "Active Users",
      value: 125000,
      unit: "users",
      category: "USERS",
    },
  });

  await prisma.platformMetric.create({
    data: {
      name: "API Calls Today",
      value: 5000000,
      unit: "calls",
      category: "USAGE",
    },
  });

  await prisma.platformMetric.create({
    data: {
      name: "Models Served",
      value: 15000000,
      unit: "inferences",
      category: "USAGE",
    },
  });

  console.log("Platform Metrics created");

  // Create Innovations
  await prisma.innovation.create({
    data: {
      title: "Novel Attention Mechanism",
      description: "Patent for efficient attention mechanism reducing compute by 60% while maintaining accuracy.",
      type: "PATENT",
      status: "ACTIVE",
      value: 2000000,
      filedAt: new Date("2024-02-15"),
    },
  });

  await prisma.innovation.create({
    data: {
      title: "Medical AI Licensing Agreement",
      description: "Licensing our medical AI technology to major healthcare providers.",
      type: "LICENSE",
      status: "ACTIVE",
      value: 5000000,
      partner: "Major Healthcare Network",
    },
  });

  console.log("Innovations created");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });