import { Injectable } from '@nestjs/common';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMultipleAttendanceDto } from './dto/create-multiple-attendance.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
  ) {}

  async createMultiple(createMultipleAttendanceDto: CreateMultipleAttendanceDto) {
    const { ids, status } = createMultipleAttendanceDto;
    const currentDate = new Date();
  
    // Mapeo de estados en español
    const statusTranslations: Record<string, string> = {
      TARDY: 'Tarde',
      ABSENT: 'Ausente',
      JUSTIFIED: 'Justificado',
    };
  
    // Crea todas las asistencias de una vez
    const attendances = ids.map((id) => ({
      studentId: id,
      status,
      date: currentDate,
    }));
  
    // Obtiene todas las relaciones de usuario-estudiante en una sola consulta
    const userOnStudents = await this.prisma.userOnStudent.findMany({
      where: { studentId: { in: ids } },
      include: { student: true },
    });
  
    // Prepara las notificaciones sin ejecutarlas aún
    const notifications = userOnStudents.map((relation) => ({
      userId: relation.userId,
      title: 'Asistencia',
      body: `El alumno ${relation.student.firstName} ${relation.student.lastName} ha sido marcado como ${statusTranslations[status]} el día ${currentDate.toLocaleDateString()}`,
      link: `/students/${relation.studentId}/attendance`,
    }));
  
    // Ejecuta la creación de notificaciones en paralelo
    await Promise.all(notifications.map((notif) => this.notification.create(notif)));
  
    // Guarda las asistencias en la base de datos
    return this.prisma.attendance.createMany({ data: attendances });
  }
  

  findByStudentId(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
    });
  }

  findOne(id: string) {
    return this.prisma.attendance.findUnique({
      where: { id },
    });
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: updateAttendanceDto,
    });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.attendance.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
