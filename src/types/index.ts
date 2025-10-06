export interface User {
  id: number;
  email: string;
  name: string;
  role: "reviewer" | "submitter";
  display_picture?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Submission {
  id: number;
  title: string;
  description?: string;
  code_content: string;
  file_name?: string;
  project_id: number;
  submitter_id: number;
  status: "pending" | "in_review" | "approved" | "changes_requested";
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: number;
  content: string;
  line_number?: number;
  submission_id: number;
  author_id: number;
  parent_comment_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewHistory {
  id: number;
  submission_id: number;
  reviewer_id: number;
  old_status: string;
  new_status: string;
  comments?: string;
  created_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  related_entity_type?: string;
  related_entity_id?: number;
  is_read: boolean;
  created_at: Date;
}
