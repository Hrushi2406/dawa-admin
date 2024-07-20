"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import orderService, {
  ICustomerEntity,
  IStatsEntity,
} from "@/services/order-service";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useDebounce } from "@/lib/useDebounce";

export default function StatsSection() {
  const [isOpen, setIsOpen] = React.useState(false);

  const [customers, setcustomers] = React.useState<ICustomerEntity[]>([]);
  const [stats, setstats] = React.useState<IStatsEntity>();

  const [refetch, setrefetch] = React.useState("no");

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = (refetch?: any) => {
    if (refetch) setrefetch(refetch);

    setIsOpen(false);
  };

  React.useEffect(() => {
    orderService.getCustomers().then((data) => setcustomers(data));
    orderService.getStats().then((data) => setstats(data));
  }, [refetch]);

  return (
    <div>
      <Button onClick={handleOpenModal} variant={"outline"}>
        Record Order{" "}
      </Button>
      <RecordOrderDialog isOpen={isOpen} closeModal={handleCloseModal} />

      <hr className="mt-2 mb-4" />
      <div className="my-6"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-4">
        <StatBox
          title="Total Revenue"
          value={`₹ ${stats?.totalRevenue ?? 0}`}
        />
        <StatBox title="Total Orders" value={stats?.totalOrders.toString()} />
        <StatBox
          title="Total Customers"
          value={stats?.totalCustomers.toString()}
        />
        <StatBox
          title="Repeat Orders"
          value={`${(stats?.totalOrders ?? 0) - (stats?.totalCustomers ?? 1)}`}
        />
        <StatBox
          title="Avg Order value"
          value={`₹ ${(
            (stats?.totalRevenue ?? 0) / (stats?.totalOrders ?? 1)
          ).toFixed(2)}`}
        />
        <StatBox
          title="Avg Customer Spent"
          value={`₹ ${(
            (stats?.totalRevenue ?? 0) / (stats?.totalCustomers ?? 1)
          ).toFixed(2)}`}
        />
      </div>
      <div className="my-6"></div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address/Society</TableHead>
            <TableHead className="text-right">Total Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((cus) => {
            return (
              <TableRow>
                <TableCell>{cus.name}</TableCell>
                <TableCell>{cus.address}</TableCell>
                <TableCell className="text-right ">
                  {cus.orders.length}
                </TableCell>
                <TableCell className="text-right text-green-700 dark:text-green-600">
                  ₹ {cus.orders.reduce((a, b) => a + b.amount, 0)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const RecordOrderDialog = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: any;
}) => {
  const [isRepeatOrder, setisRepeatOrder] = React.useState(false);
  const [customerId, setcustomerId] = React.useState<string>();
  const [customerName, setcustomerName] = React.useState("");
  const [customerAddress, setcustomerAddress] = React.useState("");
  const [amount, setamount] = React.useState(0);
  const [isLoading, setisLoading] = React.useState(false);
  const [isSearching, setisSearching] = React.useState(false);

  const [suggestions, setsuggestions] = React.useState<ICustomerEntity[]>([]);

  const debouncer = useDebounce((term: string) => {
    setisSearching(true);
    orderService.searchCustomers(term).then((data) => {
      setsuggestions(data);
      setisSearching(false);
    });
  }, 500);

  const getCustomer = async () => {
    if (isRepeatOrder && customerId) {
      // const customer = await customerService.get(customerId);
      return await orderService.getCustomer(customerId);
    } else {
      return await orderService.createCustomer(customerName, customerAddress);
    }
  };

  const recordOrder = async () => {
    const customer = await getCustomer();

    await orderService.recordEntry(customer.id, amount);
  };

  const handleNameChange = async (e: any) => {
    setcustomerName(e.target.value);
    if (isRepeatOrder) {
      if (e.target.value.length > 1 && !customerId) debouncer(e.target.value);
      else setcustomerId(undefined);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (amount <= 0)
      return toast.error("Order amount should be greater than 0");
    if (isRepeatOrder && customerId === undefined)
      return toast.error("Customer Id is required");

    setisLoading(true);
    try {
      await recordOrder();
      toast.success("Order Recorded Successfully");
      const random = Math.floor(Math.random() * 100);
      closeModal(random);
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.toString());
    }
    setisLoading(false);
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} size="md">
      <div>Record Order Dialog</div>
      <hr className="mb-4 mt-2" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-8">
          <Label className="dark:text-gray-400">Is Repeat Order</Label>
          <Switch checked={isRepeatOrder} onCheckedChange={setisRepeatOrder} />
        </div>
        <div className="relative">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={handleNameChange}
          />
          {isRepeatOrder && isSearching && (
            <Loader2 className="animate-spin absolute w-4 h-4 top-1 right-0 bottom-0 text-zinc-400" />
          )}
        </div>
        {isRepeatOrder && !customerId && suggestions.length > 0 && (
          <div className="overflow-y-auto w-full rounded-md border bg-zinc-700 p-2">
            {suggestions.map((customer: ICustomerEntity) => (
              <div
                key={customer.id}
                onClick={() => {
                  setcustomerId(customer.id);
                  setcustomerName(customer.name);
                  setcustomerAddress(customer.address);
                }}
                className="rounded-md cursor-pointer p-2 hover:bg-zinc-500"
              >
                <div className="text-sm font-medium">{customer.name}</div>
              </div>
            ))}
          </div>
        )}
        <Input
          label="Customer Address/Society"
          value={customerAddress}
          onChange={(e) => setcustomerAddress(e.target.value)}
        />
        <Input
          label="Order Total"
          value={amount}
          onChange={(e) =>
            setamount(parseFloat(e.target.value === "" ? "0" : e.target.value))
          }
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin mr-2 w-4 h-4" />} Save
        </Button>
      </form>

      {/* <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command> */}
    </Modal>
  );
};

const StatBox = ({ title, value }: { title: string; value?: string }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm mb-1 text-zinc-200 flex items-center gap-2">
        {/* <Box className="w-4 h-4 " /> */}
        {title}
      </div>
      {value && <p className="text-xl ">{value}</p>}
    </div>
  );
};
