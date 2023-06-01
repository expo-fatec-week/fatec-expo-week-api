export interface Student {
    id_pessoa: number;
    ra: string;
    nome: string;
    descricao: string;
    semestre: string;
    telefone: string;
    email: string;
    tipo: string;
}

export interface StudentByCourse {
    ra: string;
    id_pessoa: number;
    nome: string;
    curso: number;
    id_evento?: number;
    qtd_eventos_participados?: number;
}

export interface StudentByCourseWithEvents {
    ra: string;
    nome: string;
    email: string;
    descricao_evento: string;
    tipo_evento: string;
    data_evento: string;
}