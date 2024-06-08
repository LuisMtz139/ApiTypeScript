import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class AttendanceItemDTO {
    @IsNotEmpty()
    @IsNumber()
    estudiante_id!: number;

    @IsOptional()
    @IsString()
    comentarios!: string | null;
}

export class CreateAttendanceDTO {
    @IsArray()
    @ValidateNested({ each: true })
    asistencias!: AttendanceItemDTO[];
    
}
