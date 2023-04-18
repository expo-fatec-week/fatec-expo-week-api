export interface Aluno {
    ra: string;
    id_pessoa: number;
    curso: number;
    tipo: EnumTipoAluno;
    semestre: number;
    dtcria: Date;
    resp_evento: number;
}

export interface Cursos {
    id_curso: number;
    descricao: string;
    dtcria: Date;
}

export interface Evento {
    id_evento: number;
    descricao: string;
    tipo: EnumTipoEvento;
    cod_verificacao: string;
    dt_verificacao: Date;
    id_pessoa_verificacao: number;
    dtcria: Date;
    data_evento: Date;
    qtd_participantes: number;
}

export interface Pessoa {
    id_pessoa: number;
    nome: string;
    email: string;
    telefone: string;
    dtcria: Date;
}

export interface Termo {
    id_pessoa: number;
    dtcria: Date;
}

export interface Visitante {
    cpf: string;
    id_pessoa: number;
    dtcria: Date;
}

export interface Participacao {
    id_participacao: number;
    id_pessoa_participante: number;
    id_pessoa_validacao: number;
    id_evento: number;
    data_validacao: Date;
}

export enum EnumTipoEvento {
    ESTANDE = 'ESTANDE',
    PALESTRA = 'PALESTRA'
}

export enum EnumTipoAluno {
    ORGANIZADOR = 'ORGANIZADOR',
    EXPOSITOR = 'EXPOSITOR',
    VISITANTE = 'VISITANTE'
}