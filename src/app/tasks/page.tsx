import Table from "@/components/Table";

export default function Home() {
  return (
    <main className="h-screen flex-1 flex flex-col items-center gap-10 min-h-screen px-4">
      <div className="w-full h-16 rounded-2xl mt-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 float-right mr-4"></div>
      </div>

      <section className="bg-white shadow-md dark:bg-stone-900 w-full flex-1 rounded-t-[32px] pt-8">
        <div className="w-full mx-auto max-w-4xl">
          <button className="border-b-[3px] border-b-stone-700 h-fit pb-2 px-4 mr-4 focus:ring-1 focus:ring-stone-700">Table</button>

          <button className="focus:ring-1 focus:ring-stone-700 pb-2 px-4">Board</button>
        </div>

        <Table />
      </section>
    </main>
  )
}
