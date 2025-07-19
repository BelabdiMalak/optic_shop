export interface Client {
    id: string;
    name: string;
    surename: string;
    sphereL?: string ;
    sphereR?: string ;
    cylinderL?: string ;
    cylinderR?: string ;
    axisL?: string ;
    axisR?: string ;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}