import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useHospital } from '../context/HospitalContext';

export const PatientRegistrationChart: React.FC<{
  data: { month: string; registrations: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="patientAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7587ef" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7587ef" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="registrations"
            name="Registrations"
            stroke="#647be5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#patientAreaGrad)"
            animationDuration={850}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueAnalyticsChart: React.FC<{
  data: { month: string; collected: number; pending: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="collected" name="Collected ($)" fill="#28aa97" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
          <Bar dataKey="pending" name="Pending ($)" fill="#7181df" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AppointmentStatusChart: React.FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            animationDuration={850}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DepartmentBarChart: React.FC<{
  data: { department: string; count: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="department"
            stroke={axisColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" name="Appointments" fill="#687fe4" radius={[0, 5, 5, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BedOccupancyChart: React.FC<{
  data: { ward: string; available: number; occupied: number; reserved: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="ward" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="available" name="Available" stackId="beds" fill="#38aa83" radius={[0, 0, 0, 0]} animationDuration={850} animationEasing="ease-out" />
          <Bar dataKey="occupied" name="Occupied" stackId="beds" fill="#dc7184" radius={[0, 0, 0, 0]} animationDuration={850} animationEasing="ease-out" />
          <Bar dataKey="reserved" name="Reserved" stackId="beds" fill="#e4ac52" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DoctorWorkloadChart: React.FC<{
  data: { doctor: string; appointments: number; activeLoad: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="doctor" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="appointments" name="Appointments" fill="#687fe4" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
          <Bar dataKey="activeLoad" name="Active Queue / ER" fill="#35ac98" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmergencyStatsChart: React.FC<{
  data: { priority: string; count: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';
  const palette: Record<string, string> = {
    Critical: '#DC2626',
    High: '#D97706',
    Moderate: '#2563EB',
    Low: '#16A34A',
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="priority" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" name="Cases" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out">
            {data.map((entry) => (
              <Cell key={entry.priority} fill={palette[entry.priority] ?? '#2563EB'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PharmacyInventoryChart: React.FC<{
  data: { medicine: string; stock: number; reorderLevel: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="medicine" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="stock" name="Available Stock" fill="#687fe4" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
          <Bar dataKey="reorderLevel" name="Reorder Threshold" fill="#e4ac52" radius={[5, 5, 0, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PatientSatisfactionChart: React.FC<{
  data: { department: string; avgRating: number; count: number }[];
}> = ({ data }) => {
  const { theme } = useHospital();
  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" domain={[0, 5]} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="department"
            stroke={axisColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="avgRating" name="Avg Rating (/5)" fill="#35ac98" radius={[0, 5, 5, 0]} animationDuration={850} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

