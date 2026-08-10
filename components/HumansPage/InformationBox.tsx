interface InformationBoxProps {
  header: string;
  data: string;
}

export default function InformationBox({ header, data }: InformationBoxProps) {
  return (
    <div className="mt-8 rounded-xl border border-nus-blue-100 bg-nus-blue-50/60 p-6">
      <h3 className="text-lg font-bold text-nus-blue-600">{header}</h3>
      <ul className="mt-4 space-y-2.5">
        {data.split("\n").map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-700">
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nus-orange-500"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
