import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";

import KuroJackpotTable from "@/views/magic-earn/KuroJackpotTable";

const RoundHistoryPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <Zap />
        <p>Kuro</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/kuro">
          <Button variant="outline" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/kuro">Current Round</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-white">
                Round History
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <KuroJackpotTable />
    </div>
  );
};
export default RoundHistoryPage;
