export interface ResponseVisitor {
    id_pessoa: number;
    cpf: string;
    nome: string;
    telefone: string;
    email: string;
}

export interface RequestVisitor {
    name: string;
    email: string;
    tel: string;
    cpf: string;
    aceitaTermo: boolean;
}
