CREATE MIGRATION m1n77ov27xb4ridksgbmbjvcwnjoseyzwniohjwnk2b7c2mn7pmjca
    ONTO m1xon2mhoznwht53zg43lrqxyxhrbvy2mccacgovlbtm3c6vzp2qea
{
  ALTER TYPE default::Provider {
      ALTER PROPERTY logo_path {
          RESET OPTIONALITY;
      };
  };
};
