import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter letra maiúscula')
    .regex(/[a-z]/, 'Deve conter letra minúscula')
    .regex(/[0-9]/, 'Deve conter número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileForm) => {
    console.log('Profile data:', data);
    // TODO: Implement profile update
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log('Password data:', data);
    // TODO: Implement password change
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas preferências e configurações</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'profile', label: 'Perfil', icon: User },
          { id: 'password', label: 'Senha', icon: Lock },
          { id: 'notifications', label: 'Notificações', icon: Bell },
          { id: 'integrations', label: 'Integrações', icon: Globe },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'profile' && (
        <Card className="max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Alterar foto
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...profileForm.register('name')}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-r from-brand-primary to-brand-secondary"
              >
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card className="max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Atualize sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-r from-brand-primary to-brand-secondary"
              >
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Em desenvolvimento...
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'integrations' && (
        <Card className="max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>
              Gerencie integrações com serviços externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Em desenvolvimento...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Settings;
