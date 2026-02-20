export interface Grade {
    id: number;
    grade: number;
    unit: string;
}

export interface Subject {
    id: number;
    name: string;
    semester: number;
    teachers: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
    } | null;
}

export interface GradeRecord {
    id: number;
    grade: number;
    unit: string;
    subjects: Subject;
}

export type GradesBySemester = Record<number, Record<number, { subject: Subject; grades: Grade[] }>>;
