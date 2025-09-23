import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const CountdownTimerTest: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Countdown Timer (Test)</h2>
        <p className="text-muted-foreground">Testing basic functionality</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test version to check if the tool loads.</p>
          <Button className="mt-4">Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountdownTimerTest;