import EmiForm from "@/Components/EmiForm";
import MainLayout from "@/Components/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="  flex-1 flex-row">
        <div className="flex flex-1 flex-row">
          <div className="flex flex-1 flex-col overflow-y-auto mx-1">
            <div className="relative flex flex-1 md:px-[300px] md:pt-36 pt-16">
              <EmiForm />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Home;
