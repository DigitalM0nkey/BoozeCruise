DO_BOX_URL = "https://github.com/devopsgroup-io/vagrant-digitalocean/raw/master/box/digital_ocean.box"
PRIVATE_KEY_PATH = "/Users/digitalm0nkey/.ssh/id_rsa"
TOKEN = "29a7a9528ff8ac39bc7c4d1b2183875c843d46ff7383f848d43ad8f2bbbb019a"

Vagrant.configure("2") do |config|
  config.vm.define "BoozeCruise" do |droplet|
    droplet.vm.provider :digital_ocean do |provider, override|
      override.ssh.private_key_path = PRIVATE_KEY_PATH
      override.vm.box = 'digital_ocean'
      override.vm.box_url = DO_BOX_URL
      override.nfs.functional = false
      override.vm.allowed_synced_folder_types = :rsync
      provider.token = TOKEN
      provider.image = 'fedora-27-x64'
      provider.region = 'tor1'
      provider.size = '512mb'
    end
  end
end
