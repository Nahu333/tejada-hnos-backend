import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { DatabaseService } from '@services/database.service';
import { User } from '@entities/user.entity';
import { Variety } from '@entities/variety.entity';
import { Field } from '@entities/field.entity';
import { Plot } from '@entities/plot.entity';
import { WorkOrder } from '@entities/work-order.entity';
import { Activity } from '@entities/activity.entity';
import { ActivityType, UserRole, WorkOrderStatus } from '@/enums';
import { ActivityDetails, GeoJSONPolygon } from '@/types';
import { DeepPartial } from 'typeorm';

interface SeedUser {
  key: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  password: string;
  hourlyRate: number;
}

interface SeedVariety {
  key: string;
  name: string;
  description: string;
}

interface SeedField {
  key: string;
  name: string;
  address: string;
  area: number;
  managerKey: string | null;
  location: GeoJSONPolygon;
}

interface SeedPlot {
  key: string;
  name: string;
  area: number;
  fieldKey: string;
  varietyKey: string;
  location: GeoJSONPolygon;
  datePlanted?: Date;
}

interface SeedWorkOrder {
  key: string;
  title: string;
  description: string;
  scheduledDate: string;
  dueDate: string;
  completedDate?: string | null;
  status: WorkOrderStatus;
  assignedToKey: string | null;
  plotKeys: string[];
}

interface SeedActivity {
  workOrderKey: string;
  type: ActivityType;
  executionDate: string;
  hoursWorked: number;
  details: ActivityDetails;
}

const toPolygon = (coordinates: number[][]): GeoJSONPolygon => ({
  type: 'Polygon',
  coordinates: [coordinates],
});

const users: SeedUser[] = [
  {
    key: 'admin',
    email: 'admin@tejadahnos.com',
    name: 'Admin',
    lastName: 'Principal',
    role: UserRole.ADMIN,
    password: 'Admin123!',
    hourlyRate: 0,
  },
  {
    key: 'capataz1',
    email: 'capataz1@tejadahnos.com',
    name: 'Carla',
    lastName: 'Fernandez',
    role: UserRole.CAPATAZ,
    password: 'Capataz123!',
    hourlyRate: 42,
  },
  {
    key: 'capataz2',
    email: 'capataz2@tejadahnos.com',
    name: 'Miguel',
    lastName: 'Lobo',
    role: UserRole.CAPATAZ,
    password: 'Capataz123!',
    hourlyRate: 40,
  },
  {
    key: 'capataz3',
    email: 'capataz3@tejadahnos.com',
    name: 'Jimena',
    lastName: 'Quiroga',
    role: UserRole.CAPATAZ,
    password: 'Capataz123!',
    hourlyRate: 39,
  },
  {
    key: 'operario1',
    email: 'operario1@tejadahnos.com',
    name: 'Pablo',
    lastName: 'Dominguez',
    role: UserRole.OPERARIO,
    password: 'Operario123!',
    hourlyRate: 28,
  },
  {
    key: 'operario2',
    email: 'operario2@tejadahnos.com',
    name: 'Lucia',
    lastName: 'Moran',
    role: UserRole.OPERARIO,
    password: 'Operario123!',
    hourlyRate: 27,
  },
];

const varieties: SeedVariety[] = [
  {
    key: 'chandler',
    name: 'Chandler',
    description: 'Variedad californiana de alto rendimiento y fruto grande.',
  },
  {
    key: 'howard',
    name: 'Howard',
    description: 'Nuez equilibrada con excelente color y vigor vegetativo.',
  },
  {
    key: 'tulare',
    name: 'Tulare',
    description: 'Variedad precoz con buena producción anual estable.',
  },
];

const fields: SeedField[] = [
  {
    key: 'campoNorte',
    name: 'Campo Norte',
    address: 'Ruta Provincial 301 KM 12, Tafí Viejo',
    area: 120,
    managerKey: 'capataz1',
    location: toPolygon([
      [-65.2045, -26.8061],
      [-65.2021, -26.8061],
      [-65.2021, -26.8041],
      [-65.2045, -26.8041],
      [-65.2045, -26.8061],
    ]),
  },
  {
    key: 'campoSur',
    name: 'Campo Sur',
    address: 'Camino a Lules KM 8, Lules',
    area: 95,
    managerKey: 'capataz2',
    location: toPolygon([
      [-65.325, -26.92],
      [-65.322, -26.92],
      [-65.322, -26.918],
      [-65.325, -26.918],
      [-65.325, -26.92],
    ]),
  },
  {
    key: 'campoExperimental',
    name: 'Campo Experimental',
    address: 'Camino El Manantial s/n, Yerba Buena',
    area: 60,
    managerKey: null,
    location: toPolygon([
      [-65.344, -26.869],
      [-65.342, -26.869],
      [-65.342, -26.867],
      [-65.344, -26.867],
      [-65.344, -26.869],
    ]),
  },
];

const plots: SeedPlot[] = [
  {
    key: 'norteParcela1',
    name: 'Parcela Norte 1',
    area: 18,
    fieldKey: 'campoNorte',
    varietyKey: 'chandler',
    location: toPolygon([
      [-65.2042, -26.8058],
      [-65.2036, -26.8058],
      [-65.2036, -26.8052],
      [-65.2042, -26.8052],
      [-65.2042, -26.8058],
    ]),
    datePlanted: new Date('2023-08-15'),
  },
  {
    key: 'norteParcela2',
    name: 'Parcela Norte 2',
    area: 15,
    fieldKey: 'campoNorte',
    varietyKey: 'howard',
    location: toPolygon([
      [-65.2034, -26.8058],
      [-65.2028, -26.8058],
      [-65.2028, -26.8052],
      [-65.2034, -26.8052],
      [-65.2034, -26.8058],
    ]),
    datePlanted: new Date('2022-09-10'),
  },
  {
    key: 'surParcela1',
    name: 'Parcela Sur 1',
    area: 22,
    fieldKey: 'campoSur',
    varietyKey: 'tulare',
    location: toPolygon([
      [-65.3246, -26.9197],
      [-65.3239, -26.9197],
      [-65.3239, -26.9191],
      [-65.3246, -26.9191],
      [-65.3246, -26.9197],
    ]),
    datePlanted: new Date('2021-07-05'),
  },
  {
    key: 'surParcela2',
    name: 'Parcela Sur 2',
    area: 20,
    fieldKey: 'campoSur',
    varietyKey: 'chandler',
    location: toPolygon([
      [-65.3236, -26.9197],
      [-65.3229, -26.9197],
      [-65.3229, -26.9191],
      [-65.3236, -26.9191],
      [-65.3236, -26.9197],
    ]),
    datePlanted: new Date('2020-06-12'),
  },
  {
    key: 'experimentalParcela1',
    name: 'Parcela Experimental 1',
    area: 12,
    fieldKey: 'campoExperimental',
    varietyKey: 'howard',
    location: toPolygon([
      [-65.3437, -26.8687],
      [-65.3431, -26.8687],
      [-65.3431, -26.8681],
      [-65.3437, -26.8681],
      [-65.3437, -26.8687],
    ]),
    datePlanted: new Date('2024-03-18'),
  },
];

const workOrders: SeedWorkOrder[] = [
  {
    key: 'ot1',
    title: 'OT-1 - Mantenimiento de riego Norte',
    description: 'Revisión completa de goteo y caudalímetros en Parcela Norte 1.',
    scheduledDate: '2025-01-15T08:00:00Z',
    dueDate: '2025-01-16T18:00:00Z',
    status: WorkOrderStatus.IN_PROGRESS,
    assignedToKey: 'operario1',
    plotKeys: ['norteParcela1'],
  },
  {
    key: 'ot2',
    title: 'OT-2 - Fertilización foliar Norte',
    description: 'Aplicación de fertilizante foliar en las parcelas norte.',
    scheduledDate: '2025-01-20T08:00:00Z',
    dueDate: '2025-01-21T18:00:00Z',
    status: WorkOrderStatus.PENDING,
    assignedToKey: 'capataz1',
    plotKeys: ['norteParcela1', 'norteParcela2'],
  },
  {
    key: 'ot3',
    title: 'OT-3 - Control de malezas Sur',
    description: 'Retiro manual de malezas y verificación de cobertura vegetal.',
    scheduledDate: '2025-01-18T07:30:00Z',
    dueDate: '2025-01-19T17:00:00Z',
    status: WorkOrderStatus.IN_PROGRESS,
    assignedToKey: 'operario2',
    plotKeys: ['surParcela1'],
  },
  {
    key: 'ot4',
    title: 'OT-4 - Revisión de sanidad Sur',
    description: 'Monitoreo de plagas y enfermedades en Campo Sur.',
    scheduledDate: '2025-01-22T09:00:00Z',
    dueDate: '2025-01-23T13:00:00Z',
    status: WorkOrderStatus.PENDING,
    assignedToKey: 'capataz2',
    plotKeys: ['surParcela1', 'surParcela2'],
  },
  {
    key: 'ot5',
    title: 'OT-5 - Calibración de sensores experimentales',
    description: 'Ajuste y prueba de sensores de humedad en campo experimental.',
    scheduledDate: '2025-01-25T10:00:00Z',
    dueDate: '2025-01-26T15:00:00Z',
    status: WorkOrderStatus.PENDING,
    assignedToKey: 'operario1',
    plotKeys: ['experimentalParcela1'],
  },
  {
    key: 'ot6',
    title: 'OT-6 - Informe especial de rendimiento',
    description: 'Elaboración de informe de rendimiento anual y proyección 2025.',
    scheduledDate: '2025-01-28T08:30:00Z',
    dueDate: '2025-01-30T12:00:00Z',
    status: WorkOrderStatus.PENDING,
    assignedToKey: 'capataz3',
    plotKeys: ['experimentalParcela1'],
  },
];

const activities: SeedActivity[] = [
  {
    workOrderKey: 'ot1',
    type: ActivityType.RIEGO,
    executionDate: '2025-01-15T14:00:00Z',
    hoursWorked: 3.5,
    details: {
      type: ActivityType.RIEGO,
      details: {
        duracionHoras: 3.5,
        metodo: 'GOTEO',
      },
    },
  },
  {
    workOrderKey: 'ot1',
    type: ActivityType.MANTENIMIENTO,
    executionDate: '2025-01-15T17:30:00Z',
    hoursWorked: 2,
    details: {
      type: ActivityType.MANTENIMIENTO,
      details: {
        descripcion: 'Cambio de válvulas y limpieza de filtros de goteo.',
      },
    },
  },
  {
    workOrderKey: 'ot3',
    type: ActivityType.MANTENIMIENTO,
    executionDate: '2025-01-18T11:00:00Z',
    hoursWorked: 4,
    details: {
      type: ActivityType.MANTENIMIENTO,
      details: {
        descripcion: 'Desmalezado manual de líneas centrales.',
      },
    },
  },
  {
    workOrderKey: 'ot4',
    type: ActivityType.MONITOREO,
    executionDate: '2025-01-22T15:00:00Z',
    hoursWorked: 1.5,
    details: {
      type: ActivityType.MONITOREO,
      details: {
        resultado: 'Sin presencia de plagas; se recomienda seguimiento semanal.',
      },
    },
  },
  {
    workOrderKey: 'ot5',
    type: ActivityType.OTRO,
    executionDate: '2025-01-25T13:00:00Z',
    hoursWorked: 2.5,
    details: {
      type: ActivityType.OTRO,
      details: {
        descripcion: 'Reconfiguración de firmware y sincronización de gateway IoT.',
      },
    },
  },
];

async function seedTestData() {
  console.log('🌱 Iniciando seed de datos de prueba...');
  const dataSource = await DatabaseService.initialize();

  try {
    await dataSource.query('TRUNCATE TABLE "work_order_plots", "activities", "work_orders", "plots", "fields", "varieties", "users" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(User);
    const varietyRepository = dataSource.getRepository(Variety);
    const fieldRepository = dataSource.getRepository(Field);
    const plotRepository = dataSource.getRepository(Plot);
    const workOrderRepository = dataSource.getRepository(WorkOrder);
    const activityRepository = dataSource.getRepository(Activity);

    const userMap = new Map<string, User>();
    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role,
        passwordHash,
        hourlyRate: userData.hourlyRate,
      });
      userMap.set(userData.key, await userRepository.save(user));
    }

    const varietyMap = new Map<string, Variety>();
    for (const varietyData of varieties) {
      const { key: varietyKey, ...varietyFields } = varietyData;
      const variety = varietyRepository.create(varietyFields);
      varietyMap.set(varietyKey, await varietyRepository.save(variety));
    }

    const fieldMap = new Map<string, Field>();
    for (const fieldData of fields) {
      const manager = fieldData.managerKey ? userMap.get(fieldData.managerKey) ?? null : null;
      const field = fieldRepository.create({
        name: fieldData.name,
        address: fieldData.address,
        area: fieldData.area,
        location: fieldData.location,
        managerId: manager?.id ?? null,
      });
      fieldMap.set(fieldData.key, await fieldRepository.save(field));
    }

    const plotMap = new Map<string, Plot>();
    for (const plotData of plots) {
      const field = fieldMap.get(plotData.fieldKey);
      const variety = varietyMap.get(plotData.varietyKey);
      if (!field || !variety) {
        throw new Error(`No se encontró el campo o la variedad para la parcela ${plotData.key}`);
      }
      const plotDraft: DeepPartial<Plot> = {
        name: plotData.name,
        area: plotData.area,
        fieldId: field.id,
        varietyId: variety.id,
        location: plotData.location,
      };

      if (plotData.datePlanted) {
        plotDraft.datePlanted = plotData.datePlanted;
      }

      const plot = plotRepository.create(plotDraft);
      plotMap.set(plotData.key, await plotRepository.save(plot));
    }

    const workOrderMap = new Map<string, WorkOrder>();
    for (const workOrderData of workOrders) {
      const assignedUser = workOrderData.assignedToKey ? userMap.get(workOrderData.assignedToKey) ?? null : null;
      const relatedPlots = workOrderData.plotKeys.map(key => {
        const plot = plotMap.get(key);
        if (!plot) {
          throw new Error(`No se encontró la parcela ${key} para la orden ${workOrderData.key}`);
        }
        return plot;
      });

      const workOrder = workOrderRepository.create({
        title: workOrderData.title,
        description: workOrderData.description,
        scheduledDate: new Date(workOrderData.scheduledDate),
        dueDate: new Date(workOrderData.dueDate),
        completedDate: workOrderData.completedDate ? new Date(workOrderData.completedDate) : null,
        status: workOrderData.status,
        assignedToId: assignedUser?.id ?? null,
        assignedTo: assignedUser ?? null,
        plots: relatedPlots,
      });
      workOrderMap.set(workOrderData.key, await workOrderRepository.save(workOrder));
    }

    for (const activityData of activities) {
      const workOrder = workOrderMap.get(activityData.workOrderKey);
      if (!workOrder) {
        throw new Error(`No se encontró la orden ${activityData.workOrderKey} para crear actividades.`);
      }

      const activity = activityRepository.create({
        workOrderId: workOrder.id,
        type: activityData.type,
        executionDate: new Date(activityData.executionDate),
        hoursWorked: activityData.hoursWorked,
        details: activityData.details,
      });
      await activityRepository.save(activity);
    }

    console.log('✅ Datos de prueba cargados exitosamente.');
    console.log('📊 RESUMEN:');
    console.log('   • 6 Usuarios (1 Admin, 3 Capataces, 2 Operarios)');
    console.log('   • 3 Variedades');
    console.log('   • 3 Campos');
    console.log('   • 5 Parcelas');
    console.log('   • 6 Órdenes de Trabajo');
    console.log('   • 5 Actividades');
    console.log('');
    console.log('👤 USUARIOS PARA TESTING:');
    console.log('   ADMIN:');
    console.log('   • admin@tejadahnos.com / Admin123!');
    console.log('   → Acceso total sin restricciones');
    console.log('');
    console.log('   CAPATACES:');
    console.log('   • capataz1@tejadahnos.com / Capataz123! → Gestiona Campo Norte');
    console.log('   • capataz2@tejadahnos.com / Capataz123! → Gestiona Campo Sur');
    console.log('   • capataz3@tejadahnos.com / Capataz123! → Sin campos gestionados (OT-6)');
    console.log('');
    console.log('   OPERARIOS:');
    console.log('   • operario1@tejadahnos.com / Operario123! → OT-1 y OT-5');
    console.log('   • operario2@tejadahnos.com / Operario123! → OT-3');
    console.log('');
    console.log('🧪 CASOS DE PRUEBA SUGERIDOS:');
    console.log('   1. Capataz1 → debe ver OT-1 y OT-2 (Campo Norte)');
    console.log('   2. Capataz2 → debe ver OT-3 y OT-4 (Campo Sur)');
    console.log('   3. Capataz3 → solo debe ver OT-6 (sin campos asignados)');
    console.log('   4. Operario1 → solo debe ver OT-1 y OT-5');
    console.log('   5. Operario2 → solo debe ver OT-3');
    console.log('   6. Admin → debe ver todas las OTs (1-6)');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed de prueba:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedTestData();
