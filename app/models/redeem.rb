# encoding: utf-8
require 'sinatra/activerecord'

# 礼品兑换
class Redeem < ActiveRecord::Base
  self.table_name = 'sys_model_6'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, card_number, 会员卡号
  # field1, member, 兑换人
  # field2, telphone, 电话
  # field3, amount, 兑换金额
  # field4, redeem_state, 兑换状态
  # field5, gift_name, 礼品名称
  # field6, gift_id, 礼品ID
  # field7, store_id, 门店ID
  # field8, store_name, 门店名称
  # field9, serial_number, 流水号
  # field10, redeem_state, 兑换状态
  # text1, consumers, 消费列表
  # text2, gifts, 礼品信息
  #
  alias_attribute :card_number, :field0 # 会员卡号
  alias_attribute :member, :field1 # 兑换人
  alias_attribute :telphone, :field2 # 电话
  alias_attribute :amount, :field3 # 兑换金额
  alias_attribute :redeem_state, :field4 # 兑换状态
  alias_attribute :gift_name, :field5 # 礼品名称
  alias_attribute :gift_id, :field6 # 礼品ID
  alias_attribute :store_id, :field7 # 门店ID
  alias_attribute :store_name, :field8 # 门店名称
  alias_attribute :serial_number, :field9 # 流水号
  alias_attribute :redeem_state, :field10 # 流水号
  alias_attribute :consumers, :text1 # 消费列表
  alias_attribute :gifts, :text2 # 礼品信息

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:card_number] if params[:card_number]
    options[:field1] = params[:member] if params[:member]
    options[:field2] = params[:telphone] if params[:telphone]
    options[:field3] = params[:amount] if params[:amount]
    options[:field4] = params[:redeem_state] if params[:redeem_state]
    options[:field5] = params[:gift_name] if params[:gift_name]
    options[:field6] = params[:gift_id] if params[:gift_id]
    options[:field7] = params[:store_id] if params[:store_id]
    options[:field8] = params[:store_name] if params[:store_name]
    options[:field9] = params[:serial_number] if params[:serial_number]
    options[:field10] = params[:redeem_state] if params[:redeem_state]
    options[:text1] = params[:consumers] if params[:consumers]
    options[:text2] = params[:gifts] if params[:gifts]
    options
  end

  def self.find_or_create_with_params(params)
    if params[:consumers]
      params[:consumers].each_pair do |k, v|
        ::Consume.find_or_create_with_params(v);
      end
      params[:consumers] = params[:consumers].to_json
    end

    params[:gifts] = params[:gifts].to_json if params[:gifts]
    # unless record = find_by(serial_number: params[:serial_number])
      record = create(extract_params(params))
    # end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables
    all.map(&:data_table)
  end

  def data_table
    html_tags = <<-EOF
      <a disabled="disabled" href="#{ENV['API_SERVER']}/view/#{self.class_name}/edit/#{self.id}" class="btn btn-primary btn-xs iframe" title="编辑">
        <i class="fa fa-pencil-square-o"></i>
      </a>
      <a disabled="disabled" href="#{ENV['API_SERVER']}/view/#{self.class_name}/delete/#{self.id}" class="btn btn-danger btn-xs iframe" title="删除">
        <i class="fa fa-trash"></i>
      </a>
    EOF

    [
      self.id,
      self.field0,
      self.field1,
      self.field2,
      self.field3,
      self.field4,
      self.created_at.strftime("%y-%m-%m %H:%M:%S"),
      html_tags
    ]
  end

  def to_hash
    {
      id: self.id,
      card_number: self.field0,
      member: self.field1,
      telphone: self.field2,
      amount: self.field3,
      redeem_state: self.field4,
      gift_name: self.field5,
      gift_id: self.field6,
      store_id: self.field7,
      store_name: self.field8,
      serial_number: self.field9,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end