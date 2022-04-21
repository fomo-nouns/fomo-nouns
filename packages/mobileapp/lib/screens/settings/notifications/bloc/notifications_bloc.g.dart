// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notifications_bloc.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NotificationsState _$NotificationsStateFromJson(Map<String, dynamic> json) =>
    NotificationsState(
      status:
          $enumDecodeNullable(_$NotificationsStatusEnumMap, json['status']) ??
              NotificationsStatus.initial,
      onAuctionEnd: json['onAuctionEnd'] as bool? ?? false,
      fiveMinutesBeforeEnd: json['fiveMinutesBeforeEnd'] as bool? ?? false,
      tenMinutesBeforeEnd: json['tenMinutesBeforeEnd'] as bool? ?? false,
    );

Map<String, dynamic> _$NotificationsStateToJson(NotificationsState instance) =>
    <String, dynamic>{
      'status': _$NotificationsStatusEnumMap[instance.status],
      'onAuctionEnd': instance.onAuctionEnd,
      'fiveMinutesBeforeEnd': instance.fiveMinutesBeforeEnd,
      'tenMinutesBeforeEnd': instance.tenMinutesBeforeEnd,
    };

const _$NotificationsStatusEnumMap = {
  NotificationsStatus.initial: 'initial',
  NotificationsStatus.success: 'success',
  NotificationsStatus.updateFailure: 'updateFailure',
  NotificationsStatus.updating: 'updating',
};
