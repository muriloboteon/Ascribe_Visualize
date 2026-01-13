import { useState, useCallback } from 'react';
import { Tabs } from '@shopify/polaris';
import { DashboardLayout } from './components/DashboardLayout';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TestDrawer } from './components/TestDrawer';
import { HeaderDash } from './components/HeaderDash';


function App() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'dashboard-tab',
      content: 'Dashboard',
      panelID: 'dashboard-panel',
    },
    {
      id: 'test-drawer-tab',
      content: 'Test Drawer',
      panelID: 'test-drawer-panel',
    },
    {
      id: 'header-dash-tab',
      content: 'Header Dash',
      panelID: 'header-dash-panel',
    },

  ];

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
        <div style={{ flexShrink: 0, borderBottom: '1px solid #dbe1e6' }}>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {selected === 0 && <AnalyticsDashboard />}
          {selected === 1 && <TestDrawer />}
          {selected === 2 && <HeaderDash />}

        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
