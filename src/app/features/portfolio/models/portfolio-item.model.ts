export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  imageUrl: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  startDate: Date;
  endDate?: Date;
  featured?: boolean;
}

export interface PortfolioFilters {
  searchTerm: string;
  category: string | null;
  status: string | null;
  technologies: string[];
}

export interface PortfolioSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  featuredProjects: number;
}
