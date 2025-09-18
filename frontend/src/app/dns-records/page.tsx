'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Settings, 
  Search,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api, DNSRecord, Domain } from '@/lib/api';

export default function DNSRecordsPage() {
  const searchParams = useSearchParams();
  const domainId = searchParams.get('domain');

  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<number | null>(
    domainId ? parseInt(domainId) : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      fetchRecords();
    }
  }, [selectedDomain]);

  const fetchDomains = async () => {
    try {
      const data = await api.getDomains();
      setDomains(data);
      
      // 如果没有选中域名且有域名列表，默认选择第一个
      if (!selectedDomain && data.length > 0) {
        setSelectedDomain(data[0].id);
      }
    } catch (err) {
      setError('获取域名列表失败');
      console.error('Fetch domains error:', err);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDNSRecords(selectedDomain || undefined);
      setRecords(data);
    } catch (err) {
      setError('获取DNS记录失败');
      console.error('Fetch records error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条DNS记录吗？')) {
      return;
    }

    try {
      await api.deleteDNSRecord(id);
      await fetchRecords(); // 重新获取列表
    } catch (err) {
      console.error('Delete record error:', err);
      alert('删除DNS记录失败');
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'AAAA':
        return 'bg-blue-100 text-blue-800';
      case 'CNAME':
        return 'bg-purple-100 text-purple-800';
      case 'MX':
        return 'bg-orange-100 text-orange-800';
      case 'TXT':
        return 'bg-gray-100 text-gray-800';
      case 'NS':
        return 'bg-indigo-100 text-indigo-800';
      case 'SRV':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const recordTypes = [...new Set(records.map(r => r.type))];

  if (domains.length === 0 && !loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DNS记录管理</h1>
            <p className="mt-2 text-gray-600">管理您的DNS解析记录</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无可管理的域名</h3>
                <p className="text-gray-500 mb-6">
                  您需要先添加域名才能管理DNS记录。
                </p>
                <Button>前往添加域名</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DNS记录管理</h1>
            <p className="mt-2 text-gray-600">
              管理您的DNS解析记录
            </p>
          </div>
          <Button disabled={!selectedDomain}>
            <Plus className="h-4 w-4 mr-2" />
            添加记录
          </Button>
        </div>

        {/* 域名选择器 */}
        <Card>
          <CardHeader>
            <CardTitle>选择域名</CardTitle>
            <CardDescription>
              选择要管理DNS记录的域名
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {domains.map((domain) => (
                <Button
                  key={domain.id}
                  variant={selectedDomain === domain.id ? "default" : "outline"}
                  onClick={() => setSelectedDomain(domain.id)}
                  className="h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{domain.name}</div>
                    <div className="text-xs text-gray-500">{domain.provider?.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 搜索和筛选 */}
        {selectedDomain && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索记录名称或值..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">所有类型</option>
                    {recordTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 错误提示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button variant="link" size="sm" onClick={fetchRecords} className="text-red-800">
                  重试
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DNS记录列表 */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">加载中...</div>
          </div>
        ) : selectedDomain && filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterType !== 'all' ? '没有找到匹配的记录' : '暂无DNS记录'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? '请尝试调整搜索条件或筛选器' 
                    : '为这个域名添加第一条DNS记录'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加DNS记录
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={getRecordTypeColor(record.type)}
                          >
                            {record.type}
                          </Badge>
                          <Badge variant={record.is_active ? "default" : "secondary"}>
                            {record.is_active ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">类型和状态</p>
                      </div>
                      
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{record.name}</p>
                        <p className="text-sm text-gray-500">记录名称</p>
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate">{record.value}</p>
                        <p className="text-sm text-gray-500">记录值</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-900">{record.ttl}s</p>
                        <p className="text-sm text-gray-500">TTL</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {record.priority && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        优先级: <span className="font-medium">{record.priority}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        {selectedDomain && records.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{records.length}</div>
                <p className="text-sm text-gray-600">总记录数</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {records.filter(r => r.is_active).length}
                </div>
                <p className="text-sm text-gray-600">启用记录</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">
                  {records.filter(r => !r.is_active).length}
                </div>
                <p className="text-sm text-gray-600">禁用记录</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{recordTypes.length}</div>
                <p className="text-sm text-gray-600">记录类型</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}