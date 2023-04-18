export interface ResponseEvent {
    id_evento: number;
    descricao: string;
    tipo: string;
    data_evento: Date;
    cod_verificacao?: string;
}

export interface RequestGenerateCode {
    id_pessoa: string;
    id_evento: string;
}

export interface RequestValidateLecture extends RequestGenerateCode {
    cod_validacao: string;
}

export interface RequestValidateExhibit {
    id_pessoa_participante: number;
    id_pessoa_validacao: number;
    id_evento: number;
}