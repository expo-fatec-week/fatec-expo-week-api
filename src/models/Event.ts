export interface ResponseEvent {
    id_evento: number;
    descricao: string;
    tipo: string;
    data_evento: Date;
    cod_verificacao?: string;
}

export interface RequestGenerateCode {
    id_pessoa: number;
    id_evento: number;
}

export interface RequestValidateLecture {
    id_pessoa: number;
    cod_validacao: string;
}

export interface RequestValidateExhibit {
    id_pessoa_participante: number;
    id_pessoa_validacao: number;
    id_evento: number;
}

export interface ResponseEventLecture {
    descricao: string;
    nome: string;
    dt_verificacao: Date;
    cod_verificacao?: string;
}