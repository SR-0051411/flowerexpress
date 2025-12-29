import { useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Clock,
  Download,
  FileText
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/hooks/use-toast";

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

  // Export to CSV
  const exportToCSV = () => {
    try {
      const reportDate = format(new Date(), 'yyyy-MM-dd');
      
      // Summary section
      let csvContent = "Sri Mahalakshmi Flowers - Analytics Report\n";
      csvContent += `Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}\n\n`;
      
      // KPI Summary
      csvContent += "=== Summary ===\n";
      csvContent += `Total Revenue,₹${analytics.totalRevenue.toLocaleString()}\n`;
      csvContent += `Total Orders,${analytics.totalOrders}\n`;
      csvContent += `Average Order Value,₹${Math.round(analytics.avgOrderValue)}\n`;
      csvContent += `Pending Orders,${analytics.pendingOrders}\n`;
      csvContent += `Delivered Orders,${analytics.deliveredOrders}\n\n`;
      
      // Daily Sales
      csvContent += "=== Daily Sales (Last 7 Days) ===\n";
      csvContent += "Date,Revenue,Orders\n";
      analytics.dailySales.forEach(day => {
        csvContent += `${day.date},₹${day.revenue},${day.orders}\n`;
      });
      csvContent += "\n";
      
      // Top Products
      csvContent += "=== Top Selling Products ===\n";
      csvContent += "Rank,Product Name,Quantity Sold,Revenue\n";
      analytics.popularProducts.forEach((product, index) => {
        csvContent += `${index + 1},${product.name},${product.count},₹${product.revenue.toLocaleString()}\n`;
      });
      csvContent += "\n";
      
      // Status Distribution
      csvContent += "=== Order Status Distribution ===\n";
      csvContent += "Status,Count\n";
      analytics.statusDistribution.forEach(status => {
        csvContent += `${status.name},${status.value}\n`;
      });
      csvContent += "\n";
      
      // All Orders
      csvContent += "=== All Orders ===\n";
      csvContent += "Order ID,Customer Name,Phone,City,Total,Status,Date\n";
      allOrders.forEach(order => {
        csvContent += `${order.id.slice(0, 8)},${order.customerInfo.name},${order.customerInfo.phone},${order.customerInfo.city},₹${order.total},${order.status},${format(new Date(order.createdAt), 'dd MMM yyyy')}\n`;
      });
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics-report-${reportDate}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      
      toast({
        title: "CSV Exported",
        description: "Analytics report downloaded successfully",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export CSV file",
        variant: "destructive",
      });
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const reportDate = format(new Date(), 'dd MMM yyyy, hh:mm a');
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(236, 72, 153); // Pink color
      doc.text("Sri Mahalakshmi Flowers", 105, 20, { align: "center" });
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text("Sales Analytics Report", 105, 28, { align: "center" });
      
      doc.setFontSize(10);
      doc.text(`Generated: ${reportDate}`, 105, 35, { align: "center" });
      
      // Summary Box
      doc.setFillColor(249, 250, 251);
      doc.rect(14, 42, 182, 30, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Summary", 20, 50);
      
      doc.setFontSize(10);
      doc.text(`Total Revenue: ₹${analytics.totalRevenue.toLocaleString()}`, 20, 58);
      doc.text(`Total Orders: ${analytics.totalOrders}`, 80, 58);
      doc.text(`Avg Order Value: ₹${Math.round(analytics.avgOrderValue)}`, 140, 58);
      doc.text(`Pending: ${analytics.pendingOrders}`, 20, 66);
      doc.text(`Delivered: ${analytics.deliveredOrders}`, 80, 66);
      
      // Daily Sales Table
      doc.setFontSize(12);
      doc.text("Daily Sales (Last 7 Days)", 14, 82);
      
      autoTable(doc, {
        startY: 85,
        head: [['Date', 'Revenue', 'Orders']],
        body: analytics.dailySales.map(day => [
          day.date,
          `₹${day.revenue.toLocaleString()}`,
          day.orders.toString()
        ]),
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153] },
        margin: { left: 14, right: 14 },
      });
      
      // Top Products Table
      const afterDailySales = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Top Selling Products", 14, afterDailySales);
      
      autoTable(doc, {
        startY: afterDailySales + 3,
        head: [['Rank', 'Product', 'Qty Sold', 'Revenue']],
        body: analytics.popularProducts.map((product, index) => [
          (index + 1).toString(),
          product.name,
          product.count.toString(),
          `₹${product.revenue.toLocaleString()}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        margin: { left: 14, right: 14 },
      });
      
      // Status Distribution
      const afterProducts = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Order Status Distribution", 14, afterProducts);
      
      autoTable(doc, {
        startY: afterProducts + 3,
        head: [['Status', 'Count']],
        body: analytics.statusDistribution.map(status => [
          status.name.charAt(0).toUpperCase() + status.name.slice(1),
          status.value.toString()
        ]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
      });
      
      // New page for orders list if needed
      if (allOrders.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text("All Orders", 14, 20);
        
        autoTable(doc, {
          startY: 25,
          head: [['Order ID', 'Customer', 'City', 'Total', 'Status', 'Date']],
          body: allOrders.slice(0, 50).map(order => [
            order.id.slice(0, 8),
            order.customerInfo.name,
            order.customerInfo.city,
            `₹${order.total}`,
            order.status,
            format(new Date(order.createdAt), 'dd MMM yy')
          ]),
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 8 },
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - Sri Mahalakshmi Flowers`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
      
      // Save
      doc.save(`analytics-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Analytics report downloaded successfully",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF file",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Sales Analytics Dashboard
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
                disabled={allOrders.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={allOrders.length === 0}
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
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
