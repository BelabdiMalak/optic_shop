export interface Client {
    id: string;
    name: string;
    surename: string;
    sphere?: string ;
    cylinder?: string ;
    axis?: string ;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}