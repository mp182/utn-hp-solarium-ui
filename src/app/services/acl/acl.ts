interface AclType {
    [name: string]: string[];
}

export const ACL: AclType = {
    empleados: ['SuperAdmin'],
    informes: ['SuperAdmin'],
    feriados: ['SuperAdmin'],
    usuarios: ['SuperAdmin'],
    configuraciones: ['SuperAdmin'],
    servicios: ['*'],
    maquinas: ['*'],
    clientes: ['*']
    // 'add/post': ['Moderator', 'Administrator'],
};
