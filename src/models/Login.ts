export interface LoginStudent {
    ra: string;
    email: string;
}

export interface LoginVisitor {
    cpf: string;
}

export interface QueryLoginStudent {
    id_pessoa: number;
    ra: string;
    nome: string;
    descricao: string;
    semestre: number;
    telefone: string;
    email: string;
    tipo: string;
}

export interface QueryLoginVisitor {
    id_pessoa: number;
    cpf: string;
    nome: string;
    telefone: string;
    email: string;
}