import Table from "@/components/Table";

export default function page() {
    return (
        <div className="w-[300px] overflow-x-auto bg-green-50 flex flex-nowrap">
            <div className="w-16 h-4 bg-red-400"></div>
            <div className="w-[1000px] h-4 bg-yellow-100"></div>
            <Table />
        </div>

    )
}
