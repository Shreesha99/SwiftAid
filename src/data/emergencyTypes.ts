import { Heart, Zap, Wind, Brain, Baby, AlertCircle } from 'lucide-react';

export interface EmergencyType {
  id: string;
  label: string;
  icon: any;
  color: string;
  ambulanceType: 'BLS' | 'ALS' | 'Neonatal';
  tips: string[];
}

export const emergencyTypes: EmergencyType[] = [
  {
    id: 'cardiac',
    label: 'Cardiac',
    icon: Heart,
    color: 'bg-red-500',
    ambulanceType: 'ALS',
    tips: [
      'Keep the person calm and seated.',
      'Loosen tight clothing.',
      'Ask if they take heart medication.',
      'Do not give them anything to eat or drink.'
    ]
  },
  {
    id: 'accident',
    label: 'Accident/Trauma',
    icon: Zap,
    color: 'bg-orange-500',
    ambulanceType: 'BLS',
    tips: [
      'Do not move the person unless there is immediate danger.',
      'Apply pressure to bleeding wounds.',
      'Keep them warm and still.',
      'Wait for professional help.'
    ]
  },
  {
    id: 'breathing',
    label: 'Breathing Difficulty',
    icon: Wind,
    color: 'bg-blue-500',
    ambulanceType: 'BLS',
    tips: [
      'Help them sit upright.',
      'Ensure they have fresh air.',
      'Loosen tight clothing around the neck.',
      'Check for an inhaler if they are asthmatic.'
    ]
  },
  {
    id: 'stroke',
    label: 'Stroke',
    icon: Brain,
    color: 'bg-purple-500',
    ambulanceType: 'ALS',
    tips: [
      'Check for facial drooping.',
      'Check if they can raise both arms.',
      'Check for slurred speech.',
      'Note the time when symptoms started.'
    ]
  },
  {
    id: 'maternity',
    label: 'Maternity',
    icon: Baby,
    color: 'bg-pink-500',
    ambulanceType: 'Neonatal',
    tips: [
      'Help the mother lie on her left side.',
      'Keep her calm and comfortable.',
      'Monitor contraction frequency.',
      'Prepare clean towels.'
    ]
  },
  {
    id: 'general',
    label: 'General Emergency',
    icon: AlertCircle,
    color: 'bg-gray-500',
    ambulanceType: 'BLS',
    tips: [
      'Stay with the person.',
      'Keep them comfortable.',
      'Monitor their consciousness.',
      'Wait for the ambulance.'
    ]
  }
];
