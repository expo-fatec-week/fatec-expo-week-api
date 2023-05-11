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
    responsavel_evento: number;
}

export interface QueryLoginVisitor {
    id_pessoa: number;
    cpf: string;
    nome: string;
    telefone: string;
    email: string;
}

export interface Administrador {
    id: number;
    nome: string;
    email: string;
    senha: string;
    dtcria: string;
}