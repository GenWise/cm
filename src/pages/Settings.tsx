import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and configurations</p>
      </div>

      <Card className="p-12 text-center">
        <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
        <p className="text-gray-600">
          Configure programs, team members, integrations, and more
        </p>
      </Card>
    </div>
  );
}
