import { Layout, Text, Button, Icon, Tooltip, Popover, ActionList, Tag, TextField } from '@shopify/polaris';
import {
    ChartVerticalIcon,

    FilterIcon,
    MenuIcon,
    QuestionCircleIcon,
    PlusIcon,
    ShareIcon,
    RefreshIcon,
    ChevronDownIcon,
    ArrowDownIcon,
    ChevronRightIcon,
    ListBulletedIcon,
    FileIcon,
    HideIcon,
    SearchIcon,
    HomeIcon,
    ChatIcon,
    MenuHorizontalIcon,
    DeleteIcon,
    InfoIcon
} from '@shopify/polaris-icons';
import { useState, useCallback, useMemo } from 'react';

export function HeaderDash() {
    const [viewMode, setViewMode] = useState('visualize');
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
    const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
    const [isViewOptionsOpen, setIsViewOptionsOpen] = useState(false); // New State
    const [searchValue, setSearchValue] = useState('');
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

    // New: Track Current View (Custom vs Standard)
    const [currentView, setCurrentView] = useState({ title: 'Overview Analysis', isCustom: false });

    // Mock State for Filters (Option 2 Test)
    const [activeFilters, setActiveFilters] = useState(['Date: Aug 2024', 'Sentiment: Positive']);

    const toggleViewMenu = useCallback(() => {
        setIsViewMenuOpen((active) => !active);
        setSearchValue(''); // Reset search on open/close
    }, []);

    const toggleViewOptions = useCallback(() => setIsViewOptionsOpen((active) => !active), []);
    const toggleDataMenu = useCallback(() => setIsDataMenuOpen((active) => !active), []);

    const handleSearchChange = useCallback((value: string) => setSearchValue(value), []);

    // Define Menu Sections Data
    const menuSections = useMemo(() => [
        {
            title: 'Your Views',
            icon: FileIcon,
            items: [
                // Empty to show "Empty State"
            ]
        },
        {
            title: 'Standard',
            icon: HomeIcon,
            items: [
                { content: 'Overview Analysis', active: true },
                { content: 'Insights on Frequency' },
                { content: 'Sentiment Overview' },
                { content: 'Insights on Sentiment' },
                { content: 'Closed Ends' },
            ]
        },
        {
            title: 'Charts & Trends',
            icon: ChartVerticalIcon,
            items: [
                { content: 'Bar Charts by Sentiment' },
                { content: 'Block Charts by Sentiment' },
                { content: 'Trend' },
            ]
        },
        {
            title: 'Text Analysis',
            icon: ChatIcon,
            items: [
                { content: 'Word Clouds' },
                { content: 'Co-Occurrences' },
            ]
        },
        {
            title: 'Data Tables',
            icon: ListBulletedIcon,
            items: [
                { content: 'Closed End Inspection' },
                { content: 'Cross-Tabs' },
                { content: 'Bubble Matrices' },
                { content: 'X-Score Bubble Plot' },
            ]
        }
    ], []);

    const filteredSections = useMemo(() => {
        if (!searchValue) return menuSections;

        return menuSections.map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.content.toLowerCase().includes(searchValue.toLowerCase())
            )
        })).filter(section => section.items.length > 0);
    }, [searchValue, menuSections]);

    const handleRemoveFilter = useCallback((filter: string) => {
        setActiveFilters((prev) => prev.filter((f) => f !== filter));
    }, []);

    const handleAddFilter = useCallback(() => {
        setActiveFilters((prev) => [...prev, `New Filter ${prev.length + 1}`]);
    }, []);

    const handleClearAll = useCallback(() => setActiveFilters([]), []);



    const dataActivator = (
        <Button
            icon={FileIcon}
            onClick={toggleDataMenu}
            disclosure
        >
            Data
        </Button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>

            {/* === GLOBAL SUITE HEADER (Top Level) === */}
            <div style={{
                height: '48px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e1e3e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                flexShrink: 0,
                zIndex: 30
            }}>
                {/* Left: Menu & Brand & Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ cursor: 'pointer', color: '#202223' }}>
                        <Icon source={MenuIcon} tone="base" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <Text as="span" variant="headingMd" fontWeight="bold">ascribe</Text>
                    </div>

                    {/* Separator */}
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#e1e3e5', margin: '0 8px' }} />

                    {/* Breadcrumbs Trail (Moved Here) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Button variant="plain" onClick={() => setViewMode('home')}>Home</Button>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#8c9196', paddingTop: '3px' }}><Icon source={ChevronRightIcon} tone="subdued" /></div>
                        <Button variant="plain">AI Coder</Button>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#8c9196', paddingTop: '3px' }}><Icon source={ChevronRightIcon} tone="subdued" /></div>
                        <Text as="span" fontWeight="semibold">project name 1</Text>
                    </div>
                </div>

                {/* Right: Account & User Context */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', fontWeight: 500, color: '#202223' }}>

                    {/* Account Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <span>account_name</span>
                        <div style={{ width: '16px' }}><Icon source={ChevronDownIcon} tone="base" /></div>
                    </div>

                    {/* User Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <span>murilo.boteon</span>
                        <div style={{ width: '16px' }}><Icon source={ChevronDownIcon} tone="base" /></div>
                    </div>

                    {/* Help */}
                    <div style={{ cursor: 'pointer' }}>
                        <Icon source={QuestionCircleIcon} tone="base" />
                    </div>
                </div>
            </div>

            {/* === APPLICATION WORKSPACE (Sidebar + Content) === */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>



                {/* === 2. MAIN CONTENT AREA === */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>



                    {/* HEADER: Condensed & Clean */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e1e3e5',
                        padding: '16px 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0
                    }}>
                        {/* Left: Title IS Control */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Popover
                                    active={isViewMenuOpen}
                                    activator={
                                        <div
                                            onClick={toggleViewMenu}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                gap: '6px',
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                marginLeft: '-8px'
                                            }}
                                            className="hover-bg-gray"
                                        >
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#8c9196', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                VIEW:
                                            </span>
                                            {/* Note: alignItems baseline aligns the bottom of text, so this pairs nicely */}
                                            <Text as="h1" variant="headingMd" fontWeight="bold">{currentView.title}</Text>
                                            <div style={{ color: '#5c5f62', display: 'flex', alignSelf: 'center' }}><Icon source={ChevronDownIcon} tone="subdued" /></div>
                                        </div>
                                    }
                                    onClose={toggleViewMenu}
                                >
                                    <div style={{ width: '380px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        {/* Header: Search & Create */}
                                        <div style={{ padding: '8px 12px', borderBottom: '1px solid #e1e3e5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <TextField
                                                    label="Search views"
                                                    labelHidden
                                                    value={searchValue}
                                                    onChange={handleSearchChange}
                                                    placeholder="Find a view..."
                                                    autoComplete="off"
                                                    prefix={<Icon source={SearchIcon} />}
                                                    clearButton
                                                    onClearButtonClick={() => setSearchValue('')}
                                                />
                                            </div>
                                            <Tooltip content="Create a new view">
                                                <Button icon={PlusIcon} onClick={() => console.log('Create new')}>New View</Button>
                                            </Tooltip>
                                        </div>

                                        {/* Body: Compact Grid Layout (150px | 230px) */}
                                        <div style={{ height: '320px', display: 'grid', gridTemplateColumns: '150px 230px', backgroundColor: '#fff' }}>

                                            {/* Left: Sidebar */}
                                            <div style={{
                                                backgroundColor: '#f7f8fa',
                                                borderRight: '1px solid #e1e3e5',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflowY: 'auto'
                                            }}>
                                                <div style={{ padding: '8px 0' }}>
                                                    <ActionList
                                                        items={menuSections.map((section, idx) => ({
                                                            content: section.title,
                                                            icon: section.icon,
                                                            active: activeCategoryIndex === idx,
                                                            onAction: () => setActiveCategoryIndex(idx)
                                                        }))}
                                                    />
                                                </div>
                                            </div>

                                            {/* Right: Content */}
                                            <div style={{ overflowY: 'auto', overflowX: 'hidden', padding: '8px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {searchValue ? (
                                                    <ActionList
                                                        sections={filteredSections}
                                                    />
                                                ) : (
                                                    <>
                                                        <div style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 600, color: '#8c9196', textTransform: 'uppercase' }}>
                                                            {menuSections[activeCategoryIndex].title}
                                                        </div>

                                                        {menuSections[activeCategoryIndex].items.length === 0 ? (
                                                            // EMPTY STATE: Clean & Standard
                                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                                <span style={{ fontSize: '13px', color: '#8c9196' }}>No views yet</span>
                                                                <Button size="slim" icon={PlusIcon} onClick={() => console.log('Create new')}>New View</Button>
                                                            </div>
                                                        ) : (
                                                            <ActionList
                                                                items={menuSections[activeCategoryIndex].items.map(item => ({
                                                                    ...item,
                                                                    onAction: () => {
                                                                        setCurrentView({
                                                                            title: item.content,
                                                                            isCustom: menuSections[activeCategoryIndex].title === 'Your Views'
                                                                        });
                                                                        setIsViewMenuOpen(false);
                                                                    }
                                                                }))}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </Popover>

                                {/* CONDITIONAL VIEW OPTIONS (Three Dots) - Only for Custom Views */}
                                {currentView.isCustom && (
                                    <Popover
                                        active={isViewOptionsOpen}
                                        activator={
                                            <div onClick={toggleViewOptions} style={{ cursor: 'pointer', display: 'flex' }}>
                                                <Tooltip content="More actions">
                                                    <Button icon={MenuHorizontalIcon} variant="plain" size="micro" />
                                                </Tooltip>
                                            </div>
                                        }
                                        onClose={toggleViewOptions}
                                    >
                                        <ActionList
                                            items={[
                                                {
                                                    content: 'Rename View',
                                                    onAction: () => console.log('Rename'),
                                                },
                                                {
                                                    content: 'Delete View',
                                                    icon: DeleteIcon,
                                                    destructive: true,
                                                    onAction: () => {
                                                        console.log('Delete');
                                                        setIsViewOptionsOpen(false);
                                                        // Reset to default
                                                        setCurrentView({ title: 'Overview Analysis', isCustom: false });
                                                    }
                                                },
                                            ]}
                                        />
                                    </Popover>
                                )}
                            </div>

                            {/* Metadata Subtitle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#5c5f62', paddingLeft: '4px' }}>
                                <span>Question: <strong>Comments</strong></span>
                                <span style={{ color: '#e1e3e5' }}>|</span>
                                <span>Date: <strong>01/12/2026</strong></span>
                                <span style={{ color: '#e1e3e5' }}>|</span>
                                <span>Respondents: <strong>1,658</strong></span>

                                <div style={{ marginLeft: '4px', cursor: 'help' }}>
                                    <Tooltip content={
                                        <div style={{ padding: '4px' }}>
                                            <div style={{ marginBottom: '4px' }}>Coded: <strong>92% (1525 / 1658)</strong></div>
                                            <div style={{ marginBottom: '4px' }}>Comments: <strong>1,658</strong></div>
                                            <div>Last Update: <strong>10 minutes ago</strong></div>
                                        </div>
                                    }>
                                        <Icon source={InfoIcon} tone="subdued" />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        {/* Right: All Actions Restored */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Refresh moved before Data */}
                            <Tooltip content="Refresh Data">
                                <Button icon={RefreshIcon} variant="plain" accessibilityLabel="Refresh" />
                            </Tooltip>

                            <Button icon={FilterIcon} onClick={handleAddFilter}>Add filter</Button>

                            {/* Data Tools & Primary Actions Unified */}
                            <Popover
                                active={isDataMenuOpen}
                                activator={dataActivator}
                                onClose={toggleDataMenu}
                            >
                                <ActionList
                                    items={[
                                        { content: 'Load Closed-Ends', icon: ListBulletedIcon },
                                        { content: 'Ignore Codes', icon: HideIcon },
                                    ]}
                                />
                            </Popover>
                            <Button icon={PlusIcon}>Add Chart</Button>
                            <Button icon={ShareIcon}>Share</Button>
                            <Button icon={ArrowDownIcon} variant="primary">Export</Button>
                        </div>
                    </div>

                    {/* FILTER BAR: Conditional rendering again */}
                    {activeFilters.length > 0 && (
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderBottom: '1px solid #e1e3e5',
                            padding: '8px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexShrink: 0
                        }}>
                            {/* Filter Activation & Chips */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'wrap',
                                flex: 1
                            }}>
                                {activeFilters.map((filter) => (
                                    <Tag key={filter} onRemove={() => handleRemoveFilter(filter)}>{filter}</Tag>
                                ))}

                                <div style={{ height: '16px', width: '1px', borderLeft: '1px solid #e1e3e5', margin: '0 4px' }}></div>

                                <Button variant="plain" size="slim" onClick={handleClearAll} tone="critical">Clear all</Button>
                            </div>
                        </div>
                    )}

                    {/* SCROLLABLE CANVAS */}
                    <div style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: '#f6f6f7' }}>
                        <Layout>
                            <Layout.Section>
                                <div style={{
                                    padding: '60px',
                                    textAlign: 'center',
                                    border: '2px dashed #e1e3e5',
                                    borderRadius: '16px',
                                    backgroundColor: '#f1f2f450',
                                    color: '#6d7175'
                                }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Icon source={ChartVerticalIcon} tone="subdued" />
                                    </div>
                                    <Text as="h3" variant="headingMd">Dashboard Canvas</Text>
                                    <Text as="p" variant="bodySm">Your visualizations for <strong>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</strong> will live here.</Text>
                                </div>
                            </Layout.Section>
                        </Layout>
                    </div>

                </div>
            </div >
        </div >
    );
}
