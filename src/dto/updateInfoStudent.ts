import { IsString, IsOptional, IsNotEmpty, Length, IsNumberString } from 'class-validator';


export class UpdateStudentDTO {
    @IsNotEmpty()
    @IsString()
    nombre!: string;

    @IsOptional()
    @IsString()
    apellido_paterno!: string | null;

    @IsOptional()
    @IsString()
    apellido_materno!: string | null;

    @IsOptional()
    @IsString()
    @IsNumberString()
    telefono!: string | null;

    @IsOptional()
    @IsString()
    @Length(18, 18)
    curp!: string | null;

    @IsOptional()
    @IsString()
    @Length(1, 1)
    sexo!: string | null;
}

export class UpdateStudentAddressDTO {
    @IsOptional()
    @IsString()
    calle_1!: string | null;

    @IsOptional()
    @IsString()
    calle_2!: string | null;

    @IsOptional()
    @IsString()
    numero_interior!: string | null;

    @IsOptional()
    @IsString()
    numero_exterior!: string | null;

    @IsOptional()
    @IsString()
    colonia!: string | null;

    @IsOptional()
    @IsString()
    ciudad!: string | null;

    @IsOptional()
    @IsString()
    @IsNumberString()
    @Length(5, 10)
    codigo_postal!: string | null;

    @IsOptional()
    @IsString()
    referencias_direccion!: string | null;
}

export class UpdateTutorDTO {
    @IsOptional()
    @IsString()
    nombre!: string | null;

    @IsOptional()
    @IsString()
    apellido_paterno!: string | null;

    @IsOptional()
    @IsString()
    apellido_materno!: string | null;

    @IsOptional()
    @IsString()
    @IsNumberString()
    telefono!: string | null;

    @IsOptional()
    @IsString()
    @Length(18, 18)
    curp!: string | null;

    @IsOptional()
    @IsString()
    @Length(1, 1)
    sexo!: string | null;
}

export class UpdateTutorAddressDTO {
    @IsOptional()
    @IsString()
    calle_1!: string | null;

    @IsOptional()
    @IsString()
    calle_2!: string | null;

    @IsOptional()
    @IsString()
    numero_interior!: string | null;

    @IsOptional()
    @IsString()
    numero_exterior!: string | null;

    @IsOptional()
    @IsString()
    colonia!: string | null;

    @IsOptional()
    @IsString()
    ciudad!: string | null;

    @IsOptional()
    @IsString()
    @IsNumberString()
    @Length(5, 10)
    codigo_postal!: string | null;

    @IsOptional()
    @IsString()
    referencias_direccion!: string | null;
}