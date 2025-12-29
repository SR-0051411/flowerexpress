import { useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Package, 
  IndianRupee, 
  ShoppingBag,
  Users,
  Clock
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsDashboard = ({ isOpen, onClose }: AnalyticsDashboardProps) => {
  const { allOrders, fetchAllOrders, isLoadingOrders } = usePayment();
  const { isOwner, user } = useAuth();

  useEffect(() => {
    if (isOpen && isOwner) {
      fetchAllOrders();
    }
  }, [isOpen, isOwner, fetchAllOrders]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!allOrders.length) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        dailySales: [],
        popularProducts: [],
        statusDistribution: [],
        recentOrders: []
      };
    }

    // Total revenue (only from paid/delivered orders)
    const completedOrders = allOrders.filter(o => 
      ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)
    );
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = allOrders.length;
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;

    // Daily sales for last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayOrders = allOrders.filter(o => 
        isWithinInterval(new Date(o.createdAt), {
          start: startOfDay(date),
          end: endOfDay(date)
        }) && ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)
      );
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
      dailySales.push({
        date: format(date, 'dd MMM'),
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    // Popular products
    const productCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
    allOrders.forEach(order => {
      if (['paid', 'processing', 'shipped', 'delivered'].includes(order.status)) {
        order.items.forEach(item => {
          if (!productCounts[item.id]) {
            productCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
          }
          productCounts[item.id].count += item.quantity;
          productCounts[item.id].revenue += item.price * item.quantity;
        });
      }
    });
    const popularProducts = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status distribution
    const statusCounts = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      paid: allOrders.filter(o => o.status === 'paid').length,
      processing: allOrders.filter(o => o.status === 'processing').length,
      shipped: allOrders.filter(o => o.status === 'shipped').length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length
    };
    const statusDistribution = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({ name: status, value: count }));

    // Recent orders
    const recentOrders = allOrders.slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      deliveredOrders,
      dailySales,
      popularProducts,
      statusDistribution,
      recentOrders
    };
  }, [allOrders]);

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#22c55e', '#ef4444'];

  if (!isOwner || !user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            You do not have permission to view analytics.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Sales Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        {isLoadingOrders ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-xl font-bold">{analytics.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="text-xl font-bold">₹{Math.round(analytics.avgOrderValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-xl font-bold">{analytics.pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.dailySales.some(d => d.revenue > 0) ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={analytics.dailySales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value: number) => [`₹${value}`, 'Revenue']}
                          contentStyle={{ borderRadius: '8px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#ec4899" 
                          strokeWidth={2}
                          dot={{ fill: '#ec4899' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No sales data for this period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.statusDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={analytics.statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {analytics.statusDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Popular Products & Daily Orders */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Popular Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Top Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.popularProducts.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.popularProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-medium text-sm">{product.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{product.count} sold</p>
                            <p className="text-xs text-muted-foreground">₹{product.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      No product data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Daily Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Orders (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.dailySales.some(d => d.orders > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analytics.dailySales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip 
                          formatter={(value: number) => [value, 'Orders']}
                          contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      No orders in this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.recentOrders.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerInfo.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-muted-foreground">
                    No orders yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsDashboard;
